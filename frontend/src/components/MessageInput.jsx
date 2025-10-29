import { useRef, useState } from 'react';
import useChatStore from '../store/useChatStore';
import { Send, X, Loader2, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const MessageInput = () => {
  const [text, setText] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const { sendMessage, selectedUser } = useChatStore();

  // Native Image constructor is now safe to use
  const compressImage = (file, maxWidth = 1024, quality = 0.8) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image(); // This works now
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = (maxWidth / width) * height;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (!blob) return reject(new Error('Compression failed'));
              const compressedFile = new File([blob], file.name, { type: file.type });
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result);
              reader.onerror = reject;
              reader.readAsDataURL(compressedFile);
            },
            file.type,
            quality
          );
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image');
      return;
    }

    setIsUploading(true);
    try {
      const compressedBase64 = await compressImage(file, 1024, 0.8);
      setImagePreview(compressedBase64);
      toast.success('Image compressed & ready!');
    } catch (err) {
      console.error('Compression error:', err);
      toast.error('Failed to process image');
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!text.trim() && !imagePreview) {
      toast.error('Add text or image');
      return;
    }

    if (!selectedUser?._id) {
      toast.error('Select a user');
      return;
    }

    setIsUploading(true);
    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview || '',
        receiverId: selectedUser._id,
      });

      toast.success('Sent!');
      setText('');
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      toast.error(error.response?.data?.error || 'Send failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-4 w-full bg-base-100 border-t border-zinc-800">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center"
              disabled={isUploading}
            >
              <X className="w-3 h-3 text-white" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="flex-1 input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isUploading}
          />

          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`hidden sm:flex btn btn-circle btn-sm ${
              imagePreview ? 'text-emerald-500' : 'text-zinc-400'
            }`}
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <ImageIcon size={20} />
            )}
          </button>
        </div>

        <button
          type="submit"
          className="btn btn-sm btn-circle btn-primary"
          disabled={isUploading || (!text.trim() && !imagePreview)}
        >
          {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send size={22} />}
        </button>
      </form>
    </div>
  );
};

export default MessageInput;