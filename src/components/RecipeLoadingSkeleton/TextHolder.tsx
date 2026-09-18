import { PlaceHolder } from './PlaceHolder';

export function TextHolder() {
  return (
    <div className='flex min-w-0 flex-1 flex-col gap-3'>
      <PlaceHolder className='h-7 w-3/4' />
      <PlaceHolder className='h-5 w-full' />
      <PlaceHolder className='h-5 w-4/5' />
      <PlaceHolder className='mt-auto h-6 w-1/2' />
    </div>
  );
}
