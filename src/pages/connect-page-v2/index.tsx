import { useEffect, useState } from 'react';
import {
  exchangeForLongLivedToken,
  getFacebookPages,
  initFacebookSDK,
  loginWithFacebook,
} from '../../lib/facebook';
import axios from 'axios';
import { supabase } from '../../lib/supabase';

const ConnectPageV2 = () => {
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
  console.log(sdkReady);
  const handleConnect = async () => {
    if (!sdkReady) {
      setError('Facebook SDK is not ready yet. Please try again.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const authResponse = await loginWithFacebook();
      console.log('authResponse', authResponse);
      const longLivedToken = await exchangeForLongLivedToken(authResponse.accessToken);
      console.log('Obtained long-lived user token', longLivedToken);
      const pages = await getFacebookPages(longLivedToken);
      console.log(`Found ${pages.length} pages to connect`, pages);
    } catch (err) {
      console.error('Connect error:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect to Facebook');
    } finally {
      setLoading(false);
    }
  };
  const createPost = async () => {
    try {
      const res = await axios.post(`https://graph.facebook.com/592625063941721/feed`, null, {
        params: {
          message:
            'HOÁ QUÝ CÔ THỜI THƯỢNG CÙNG ĐẦM ĐEN CÁCH ĐIỆU SIÊU SANG ♥️ Thiết kế cổ lệch độc đáo cùng điểm nhấn cúc vàng kim nổi bật tạo nên thần thái sang xịn mịn. Phần eo chiết nhẹ hack dáng siêu đỉnh, chất liệu dập nhăn cao cấp giúp form đứng hoàn hảo.',
          access_token:
            'EAAOzncjdBccBOZBXyVMa7qtqzsZCwKZCTO1iujpgF1HHCRflZCM7yZB6NrjDyqaLq3PX6eZCZCmhYo7ZAH0osRfBTUKqabeJR0tXLim9kBDrxvuXwNNH2fPTG9nvoZCvcAlOvX6z4rayg4lo5hBCWX1dQK8DLNSYNkZCBTiKGhVbe2sVxPwKEBayvVEwfzJ9VNlEt9CiXEMWSZBq2mt2PgdZCgkxWQhjkZAljFm7qbFORAD9n',
        },
      });
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `images/${fileName}`; // Thư mục `images` trong bucket

    const { data, error } = await supabase.storage.from('post-images').upload(filePath, file, {
      metadata: {
        owner: (await supabase.auth.getUser())?.data?.user?.id || '', // Gửi user_id
      },
    });

    if (error) {
      console.error('Upload failed:', error.message);
      return null;
    }

    const { data: publicUrl } = supabase.storage.from('post-images').getPublicUrl(filePath);

    return publicUrl.publicUrl;
  };
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = await uploadImage(file);
    if (url) {
      console.log('Uploaded image URL:', url);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <div onClick={createPost}>create post</div>
      <h1>Connect Page V2</h1>
      <button onClick={handleConnect}>click fb 241321</button>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {!sdkReady && <p>SDK is not ready yet.</p>}
    </div>
  );
};

export default ConnectPageV2;
