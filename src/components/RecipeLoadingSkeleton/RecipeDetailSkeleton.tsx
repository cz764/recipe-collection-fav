import { PlaceHolder } from './PlaceHolder';

/** Mirrors the RecipeContent layout so the details page keeps its shape while loading. */
export function RecipeDetailSkeleton() {
  return (
    <div role='status' aria-label='Loading recipe' className='w-full min-w-0'>
      <span className='sr-only'>Loading recipe…</span>
      <div aria-hidden='true' className='flex flex-col gap-2 p-2'>
        <div className='flex h-6 items-center gap-2'>
          <PlaceHolder className='h-4 w-20' />
          <PlaceHolder className='h-4 w-32' />
        </div>
        <div className='flex flex-col items-center justify-center gap-4 lg:flex-row'>
          <PlaceHolder className='h-[300px] w-full max-w-sm' />
          <PlaceHolder className='h-9 w-64' />
        </div>
        <div className='bg-divider h-px w-full' />
        <PlaceHolder className='h-5 w-full' />
        <PlaceHolder className='h-5 w-3/4' />
        {[0, 1].map((index) => (
          <div key={index} className='flex flex-col gap-2'>
            <PlaceHolder className='h-7 w-32' />
            <div className='bg-divider h-px w-full' />
            <PlaceHolder className='h-5 w-1/2' />
          </div>
        ))}
        <div className='bg-divider h-px w-full' />
        <div className='flex flex-col gap-6 lg:flex-row'>
          <div className='flex min-w-2xs flex-col gap-3'>
            <PlaceHolder className='h-6 w-28' />
            {Array.from({ length: 5 }, (_, index) => (
              <PlaceHolder key={index} className='h-5 w-48' />
            ))}
          </div>
          <div className='flex min-w-0 flex-1 flex-col gap-3'>
            <PlaceHolder className='h-6 w-20' />
            {Array.from({ length: 6 }, (_, index) => (
              <PlaceHolder key={index} className='h-5 w-full' />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
