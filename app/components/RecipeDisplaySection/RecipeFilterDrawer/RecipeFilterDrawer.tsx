import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
} from '@heroui/drawer';
import { Button } from '@heroui/button';

interface RecipeFilterDrawerProps {
  isOpen: boolean;
  onOpenChange: () => void;
}

export function RecipeFilterDrawer({
  isOpen,
  onOpenChange,
}: RecipeFilterDrawerProps) {
  return (
    <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        {(onClose) => (
          <>
            <DrawerHeader className='flex flex-col gap-1'>
              Filter Recipes
            </DrawerHeader>
            <DrawerBody>
              <p>type</p>
              <p>breakfast</p>
              <p>lunch</p>
            </DrawerBody>
            <DrawerFooter>
              <Button color='danger' variant='light' onPress={onClose}>
                Close
              </Button>
              <Button color='primary' onPress={onClose}>
                Filter
              </Button>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}
