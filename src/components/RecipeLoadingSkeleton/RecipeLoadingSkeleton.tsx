import { PlaceHolder } from './PlaceHolder';
import { TextHolder } from './TextHolder';

export function RecipeLoadingSkeleton() {
  return (
    <div role='status' aria-label='Loading recipes' className='w-full min-w-0'>
      <span className='sr-only'>Loading recipes…</span>
      <div aria-hidden='true' className='flex flex-col gap-4'>
        <div className='flex flex-col gap-2 md:gap-6 xl:flex-row'>
          <div className='w-full min-w-0 rounded-xl bg-white p-3 shadow-sm xl:max-w-3/5'>
            <div className='flex flex-col gap-6 lg:flex-row'>
              <PlaceHolder className='aspect-square w-full max-w-72 shrink-0' />
              <TextHolder />
            </div>
          </div>
          <div className='flex min-w-0 flex-1 flex-col gap-8'>
            {[0, 1].map((index) => (
              <div
                key={index}
                className='flex flex-col gap-6 rounded-xl bg-white p-3 shadow-sm lg:flex-row'
              >
                <PlaceHolder className='size-30 shrink-0' />
                <TextHolder />
              </div>
            ))}
          </div>
        </div>
        <div className='bg-divider h-px w-full' />
        <div className='flex flex-col gap-2'>
          <div className='flex flex-col gap-1'>
            <div className='flex w-full max-w-xl flex-col items-center gap-6 lg:flex-row'>
              <PlaceHolder className='h-10 w-full max-w-sm' />
              <PlaceHolder className='size-10 shrink-0' />
              <PlaceHolder className='h-10 w-full max-w-xs' />
            </div>
            <div className='flex h-6 justify-end'>
              <PlaceHolder className='h-5 w-20' />
            </div>
          </div>
          <div className='grid min-h-96 grid-cols-1 content-start gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {Array.from({ length: 6 }, (_, index) => (
              <div
                key={index}
                className='flex flex-col gap-2 rounded-xl bg-white p-3 shadow-sm'
              >
                <PlaceHolder className='aspect-square w-full' />
                <TextHolder />
              </div>
            ))}
          </div>
          <div className='min-h-10' />
        </div>
      </div>
    </div>
  );
}
