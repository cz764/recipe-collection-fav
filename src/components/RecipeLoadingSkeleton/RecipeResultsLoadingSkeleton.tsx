import { PlaceHolder } from './PlaceHolder';
import { TextHolder } from './TextHolder';

export function RecipeResultsLoadingSkeleton() {
  return (
    <div
      role='status'
      aria-label='Loading recipe results'
      className='w-full min-w-0'
    >
      <span className='sr-only'>Loading recipe results…</span>
      <div aria-hidden='true'>
        <div className='flex flex-col gap-2'>
          <div className='flex flex-col gap-1'>
            <div className='w-full'>
              <PlaceHolder className='h-10 w-full max-w-sm' />
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
