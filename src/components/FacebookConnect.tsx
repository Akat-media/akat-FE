import React, { useState, useEffect } from 'react';
import { Facebook, AlertCircle, Loader2, Shield, MessageSquare, Bell } from 'lucide-react';
import {
  initFacebookSDK,
  loginWithFacebook,
  getFacebookPages,
  connectFacebookPage,
  exchangeForLongLivedToken,
  getLongLivedPageToken,
  REQUIRED_PERMISSIONS,
} from '../lib/facebook';
import axios from 'axios';
import { BaseUrl } from '../constants';
import FacebookGraphAdapter from '../constants/FacebookGraphAdapter';

interface FacebookConnectProps {
  onConnect: () => void;
}
function FacebookConnect({ onConnect }: FacebookConnectProps) {
  const user = localStorage.getItem('user');
  console.log(JSON.parse(user || '{}')?.user_id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sdkReady, setSdkReady] = useState(false);
  useEffect(() => {
    initFacebookSDK()
      .then(() => setSdkReady(true))
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Failed to initialize Facebook SDK')
      );
  }, []);
  const handleConnect = async () => {
    if (!sdkReady) {
      setError('Facebook SDK is not ready yet. Please try again.');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      // Login and get access token
      const authResponse = await loginWithFacebook();
      // Exchange for long-lived user token
      const longLivedToken = await exchangeForLongLivedToken(authResponse.accessToken);
      // console.log('Obtained long-lived user token');
      const pages = await getFacebookPages(longLivedToken);
      const fanpage = await Promise.all(
        pages.map((page) => connectFacebookPageV2({ ...page, access_token: longLivedToken }))
      );
      console.log('fanpage', fanpage);
      onConnect();
    } catch (err) {
      console.error('Connect error:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect to Facebook');
    } finally {
      setLoading(false);
    }
  };
  const fetchPostsCount = async (
    since: number,
    until: number,
    token: string,
    page_id: string
  ): Promise<number> => {
    let totalCount = 0;
    // Graph API endpoint với tham số since và until (timestamp theo giây)
    let url = `https://graph.facebook.com/v22.0/${page_id}/posts?since=${since}&until=${until}&limit=25&access_token=${token}`;
    while (url) {
      const response = await axios.get(url);
      const data = response.data;
      // console.log('data' + data);
      if (data.error) {
        throw new Error(data.error.message);
      }
      if (data.data && Array.isArray(data.data)) {
        totalCount += data.data.length;
      }
      // Nếu có phân trang, chuyển sang trang tiếp theo, nếu không dừng vòng lặp.
      url = data.paging && data.paging.next ? data.paging.next : '';
    }

    return totalCount;
  };
  const connectFacebookPageV2 = async (page: any) => {
    const today = Math.floor(Date.now() / 1000);
    const since = today - 28 * 24 * 60 * 60;
    try {
      await axios.post(`${BaseUrl}/facebook-fan-page`, {
        id: page.id,
        page_name: page.name,
        page_category: page.category,
        page_url: page.page_url,
        page_avatar_url: page.avatar_url,
        follower_count: page.follower_count || 0,
        fan_count: page.fan_count || 0,
        page_type: page.page_type,
        connection_id: '1',
      });
      const longLivedUserToken = await exchangeForLongLivedToken(page.access_token);
      const longLivedPageToken = await getLongLivedPageToken(page.id, longLivedUserToken);
      const { data: existingConnection } = await axios.get(`${BaseUrl}/facebook-connection`, {
        params: {
          user_id: JSON.parse(user || '{}')?.user_id,
          facebook_fanpage_id: page.id,
        },
      });
      const postsCount = await fetchPostsCount(since, today, longLivedPageToken, page.id);
      console.log('postsCount', postsCount);
      if (existingConnection.data.length > 0) {
        console.log(1);
        await axios.put(`${BaseUrl}/facebook-connection/${existingConnection.data?.[0]?.id}`, {
          access_token: [longLivedPageToken],
          status: 'connected',
          last_sync: new Date().toISOString(),
          user_id: JSON.parse(user || '{}')?.user_id,
          facebook_fanpage_id: page.id,
        });
      } else {
        const nameAndImage = `https://graph.facebook.com/v22.0/${page.id}?fields=name,picture&access_token=${longLivedPageToken}`;
        const followersUrl = `https://graph.facebook.com/v22.0/${page.id}/insights?metric=page_daily_follows_unique&period=days_28&access_token=${longLivedPageToken}`;
        const postRemain = `https://graph.facebook.com/v22.0/${page.id}/insights?metric=page_impressions_unique,page_post_engagements&period=days_28&access_token=${longLivedPageToken}`;
        const categoryAndStatusPage = `https://graph.facebook.com/v22.0/${page.id}?fields=category%2Cis_published&access_token=${longLivedPageToken}`;

        const [nameImageRes, followersRes, postRemainRes, categoryAndStatusRes] = await Promise.all(
          [
            axios.get(nameAndImage),
            axios.get(followersUrl),
            axios.get(postRemain),
            axios.get(categoryAndStatusPage),
            axios.post(`${BaseUrl}/facebook-connection`, {
              access_token: [longLivedPageToken],
              status: 'connected',
              permissions: REQUIRED_PERMISSIONS,
              last_sync: null,
              user_id: JSON.parse(user || '{}')?.user_id,
              facebook_fanpage_id: page.id,
              role_id: '1',
              page_url: page.page_url,
              page_avatar_url: page.avatar_url,
              follower_count: page.follower_count || 0,
              fan_count: page.fan_count || 0,
              page_type: page.page_type,
            }),
          ]
        );
        // console.log('fidnal', nameImageRes, followersRes, postRemainRes, categoryAndStatusRes);
        // console.log(FacebookGraphAdapter.transformFollowers(followersRes.data));
        await axios.post(`${BaseUrl}/facebook-page-insight`, {
          posts: postsCount,
          approach: FacebookGraphAdapter.transformPostRemain(postRemainRes?.data).impressions,
          interactions: FacebookGraphAdapter.transformPostRemain(postRemainRes?.data).engagements,
          follows: FacebookGraphAdapter.transformFollowers(followersRes.data)?.followersCount || 0,
          name: nameImageRes?.data?.name || '',
          image_url: nameImageRes?.data?.picture?.data?.url || '',
          category: FacebookGraphAdapter.transformCategoryAndStatusPage(categoryAndStatusRes?.data)
            .category,
          status: FacebookGraphAdapter.transformCategoryAndStatusPage(categoryAndStatusRes?.data)
            .isPublished,
          user_id: JSON.parse(user || '{}')?.user_id,
          facebook_fanpage_id: page.id,
        });
      }
    } catch (error) {
      console.error('Error connecting Facebook page:', error);
      throw error;
    }
  };

  return (
    <div className="space-y-3">
      {error && (
        <div className="p-2 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <p className="font-medium">{error}</p>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg p-4 mb-4">
        <h4 className="font-medium text-blue-900 mb-3">Hướng dẫn kết nối</h4>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-2">
            <div className="flex items-center justify-center w-5 h-5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium mt-0.5">
              1
            </div>
            <p className="text-blue-800">Đăng nhập vào tài khoản Facebook của bạn</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="flex items-center justify-center w-5 h-5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium mt-0.5">
              2
            </div>
            <p className="text-blue-800">Chọn các Facebook Pages bạn muốn kết nối</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="flex items-center justify-center w-5 h-5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium mt-0.5">
              3
            </div>
            <p className="text-blue-800">Cấp quyền truy cập cho ứng dụng</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="flex items-center justify-center w-5 h-5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium mt-0.5">
              4
            </div>
            <p className="text-blue-800">Xác nhận và hoàn tất kết nối</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-600">
        <div className="flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Tin nhắn</span>
        </div>
        <span>•</span>
        <div className="flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5" />
          <span>Kiểm duyệt</span>
        </div>
        <span>•</span>
        <div className="flex items-center gap-1.5">
          <Bell className="w-3.5 h-3.5" />
          <span>Thông báo</span>
        </div>
      </div>

      <button
        onClick={handleConnect}
        disabled={loading || !sdkReady}
        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#1877F2] text-white rounded-lg hover:bg-[#1664d9] transition-colors disabled:opacity-50 text-sm"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Đang kết nối...</span>
          </>
        ) : !sdkReady ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Đang khởi tạo...</span>
          </>
        ) : (
          <>
            <Facebook className="w-4 h-4" />
            <span>Kết nối với Facebook</span>
          </>
        )}
      </button>
    </div>
  );
}

export default FacebookConnect;
