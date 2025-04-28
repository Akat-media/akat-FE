import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import { getDefaultEngineConfig } from '../lib/automation';

interface MonitoredPages {
  [pageId: string]: boolean | undefined;
}

interface MonitoringState {
  monitoredPages: MonitoredPages;
  loading: boolean;
  loadingPages: { [pageId: string]: boolean };
  error: string | null;
  syncing: boolean;
  setPageMonitoring: (pageId: string, isMonitored: boolean) => Promise<void>;
  initializeMonitoring: (pageIds: string[]) => void;
  getPageMonitoring: (pageId: string) => boolean | undefined;
  syncWithDatabase: () => Promise<void>;
}
interface ModerationEngine {
  page_id: string;
  engine_status: 'active' | 'inactive' | string;
}

export const useMonitoringStore = create<
  MonitoringState,
  [['zustand/persist', Partial<MonitoringState>]]
>(
  persist(
    (set, get) => ({
      monitoredPages: {},
      loading: false,
      loadingPages: {},
      error: null,
      syncing: false,

      setPageMonitoring: async (pageId: string, isMonitored: boolean) => {
        try {
          console.log('Starting monitoring toggle:', { pageId, isMonitored });
          set((state) => ({
            loadingPages: { ...state.loadingPages, [pageId]: true },
            error: null,
          }));

          const { data: currentEngine, error: fetchError } = await supabase
            .from('auto_engines')
            .select('*')
            .eq('page_id', pageId)
            .eq('type', 'moderation')
            .single();

          if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

          if (!currentEngine) {
            const { error: insertError } = await supabase.from('auto_engines').insert({
              name: 'Content Moderation',
              description: 'Automated content moderation for Facebook page',
              page_id: pageId,
              type: 'moderation',
              status: isMonitored ? 'active' : 'paused',
              config: getDefaultEngineConfig('moderation'),
              updated_at: new Date().toISOString(),
            });

            if (insertError) throw insertError;
          } else {
            const { error: updateError } = await supabase
              .from('auto_engines')
              .update({
                status: isMonitored ? 'active' : 'paused',
                updated_at: new Date().toISOString(),
              })
              .eq('id', currentEngine.id);

            if (updateError) throw updateError;
          }

          set((state) => ({
            monitoredPages: {
              ...state.monitoredPages,
              [pageId]: isMonitored,
            },
            loadingPages: { ...state.loadingPages, [pageId]: false },
          }));
        } catch (err) {
          set((state) => ({
            error: err instanceof Error ? err.message : 'Failed to update monitoring status',
            loadingPages: { ...state.loadingPages, [pageId]: false },
            monitoredPages: {
              ...state.monitoredPages,
              [pageId]: state.monitoredPages[pageId],
            },
          }));
        }
      },

      syncWithDatabase: async () => {
        try {
          set({
            syncing: true,
            error: null,
          });

          const { data: moderationEngines, error: fetchError } = await supabase.rpc(
            'get_latest_moderation_status',
            {}
          );

          if (fetchError) throw fetchError;

          const newMonitoredPages: MonitoredPages = {};

          moderationEngines?.forEach((engine: ModerationEngine) => {
            if (engine.engine_status) {
              newMonitoredPages[engine.page_id] = engine.engine_status === 'active';
            }
          });

          set({
            monitoredPages: newMonitoredPages,
            syncing: false,
            error: null,
          });
        } catch (err) {
          set((state) => ({
            error: err instanceof Error ? err.message : 'Failed to sync with database',
            monitoredPages: state.monitoredPages,
            syncing: false,
          }));
        }
      },

      initializeMonitoring: (pageIds: string[]) => {
        set((state) => ({
          monitoredPages: state.monitoredPages,
          loadingPages: pageIds.reduce((acc, id) => ({ ...acc, [id]: false }), {}),
          loading: true,
        }));

        get()
          .syncWithDatabase()
          .finally(() => {
            set(() => ({
              loading: false,
            }));
          });
      },

      getPageMonitoring: (pageId: string) => {
        const state = get();
        if (state.monitoredPages && state.monitoredPages[pageId] !== undefined) {
          return state.monitoredPages[pageId];
        }
        return false;
      },
    }),
    {
      name: 'monitoring-storage',
      partialize: (state: MonitoringState): Partial<MonitoringState> => ({
        monitoredPages: state.monitoredPages,
      }),
    }
  )
);
