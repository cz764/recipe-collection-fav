import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
} from '@heroui/drawer';
import { Button } from '@heroui/button';
import { CheckboxGroup, Checkbox } from '@heroui/checkbox';

interface RecipeFilterDrawerProps {
  isOpen: boolean;
  onOpenChange: () => void;
}

const checkboxGroupClasses = 'rounded-md border p-4';

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
              <CheckboxGroup
                color='secondary'
                className={checkboxGroupClasses}
                defaultValue={['breakfast']}
                label='Type'
                orientation='horizontal'
              >
                <Checkbox value='breakfast'>Breakfast</Checkbox>
                <Checkbox value='lunch'>Lunch</Checkbox>
                <Checkbox value='dinner'>Dinner</Checkbox>
                <Checkbox value='dessert'>Dessert</Checkbox>
                <Checkbox value='snack'>Snack</Checkbox>
              </CheckboxGroup>
              <CheckboxGroup
                color='secondary'
                className={checkboxGroupClasses}
                defaultValue={['en']}
                label='Language'
                orientation='horizontal'
              >
                <Checkbox value='en'>English</Checkbox>
                <Checkbox value='ch'>中文</Checkbox>
              </CheckboxGroup>
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
