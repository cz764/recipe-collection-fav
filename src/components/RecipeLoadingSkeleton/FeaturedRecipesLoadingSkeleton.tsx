import { PlaceHolder } from './PlaceHolder';
import { TextHolder } from './TextHolder';

export function FeaturedRecipesLoadingSkeleton() {
  return (
    <div
      role='status'
      aria-label='Loading featured recipes'
      className='w-full min-w-0'
    >
      <span className='sr-only'>Loading featured recipes…</span>
      <div aria-hidden='true'>
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
      </div>
    </div>
  );
}
