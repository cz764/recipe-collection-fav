interface PlaceHolderProps {
  className: string;
}

export function PlaceHolder({ className }: PlaceHolderProps) {
  return (
    <div className={`recipe-loading-placeholder rounded-lg ${className}`} />
  );
}
