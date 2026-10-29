import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { CiImageOn } from 'react-icons/ci';
import { FaSpinner } from 'react-icons/fa';
import { TiDelete } from 'react-icons/ti';

export default function PostCreation() {
  const [isUploaded, setisUploaded] = useState('');

  const query = useQueryClient();

  // const imgInput = useRef(null);

  // const textInput = useRef(null);

  const form = useForm({
    defaultValues: {
      body: '',
      image: '',
    },
  });

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setisUploaded(URL.createObjectURL(file));
  }

  const { register, handleSubmit, reset } = form;
  const formData = new FormData();

  function createPost() {
    return axios.post(`https://route-posts.routemisr.com/posts`, formData, {
      headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` },
    });
  }

  const { isPending, mutate } = useMutation({
    mutationFn: createPost,
    onSuccess: (res) => {
      toast.success(res.data.message);
      reset();
      query.invalidateQueries({ queryKey: ['getAllPosts'] });

      setisUploaded('');
    },
    onError: () => {},
    onSettled: () => {},
  });

  function handlePost(values: { body: string; image: string }) {
    if (!values.body && !values.image) return;

    if (values.image) {
      formData.append('image', values.image[0]);
    }

    if (values.body) {
      formData.append('body', values.body);
    }

    console.log(values);
    mutate();
  }

  return (
    <>
      {/* Post creation card */}
      <div className='mx-auto my-5 w-full max-w-xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm'>
        <form onSubmit={handleSubmit(handlePost)}>
          {/* Header: avatar + name + privacy */}
          <div className='flex items-center gap-3 px-5 pt-5'>
            <div>
              <select className='mt-0.5 cursor-pointer rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs text-gray-600 transition focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100'>
                <option value='public'>Public</option>
                <option value='followers'>Followers</option>
                <option value='only_me'>Only me</option>
              </select>
            </div>
          </div>
          {/* Body textarea */}
          <div className='px-5 pt-4'>
            <textarea
              {...register('body')}
              rows={4}
              placeholder="What's on your mind?"
              className='w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-relaxed text-gray-900 placeholder-gray-400 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100'
            />
          </div>
          {/* Image preview (show only when an image is selected) */}
          {isUploaded && (
            <div className='relative px-5 pt-3'>
              <img
                src={isUploaded}
                alt='selected image preview'
                className='max-h-72 w-full rounded-xl object-cover'
              />
              {/* Remove image button */}
              <button
                type='button'
                className='absolute right-8 top-6 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80'
              >
                <TiDelete
                  className='w-6 h-6'
                  onClick={() => setisUploaded('')}
                />
              </button>
            </div>
          )}
          {/* Footer: actions + submit */}
          <div className='mt-4 flex items-center justify-between border-t border-gray-100 px-5 py-3'>
            <div className='flex items-center gap-1'>
              {/* Add image */}
              <label className='flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-blue-600'>
                <CiImageOn />
                Photo
                <input
                  type='file'
                  accept='image/*'
                  hidden
                  {...register('image', { onChange: handleImage })}
                />
              </label>
              
            
            </div>
            {/* Submit */}
            {isPending ? (
              <FaSpinner className='animate-spin' />
            ) : (
              <button
                type='submit'
                className='cursor-pointer rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60'
              >
                Add Post
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
}
