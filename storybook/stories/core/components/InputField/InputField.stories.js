import InputField from '@orangehrm/oxd/core/components/InputField/InputField';
import {TYPES} from '@orangehrm/oxd/core/components/InputField/types';
import InputFieldValidation from './InputFieldValidation.story.vue';
import Form from '@orangehrm/oxd/core/components/Form/Form';
import {h, ref} from 'vue';

export default {
  title: 'Example/InputField',
  component: InputField,
};

const argTypes = {
  type: {
    control: {type: 'select', options: TYPES},
  },
};

const Template = args => ({
  setup() {
    return {args};
  },
  components: {'oxd-input-field': InputField, 'oxd-form': Form},
  template: '<oxd-form><oxd-input-field v-bind="args" /></oxd-form>',
});

const DropdownTemplate = args => ({
  setup() {
    const selected = ref([]);
    return {args, selected};
  },
  render() {
    return h(
      Form,
      {},
      {
        default: () => {
          return h(InputField, {
            ...this.args,
            modelValue: this.selected,
            'onUpdate:modelValue': value => {
              this.selected = [...value];
            },
          });
        },
      },
    );
  },
});

export const Default = Template.bind({});
Default.argTypes = argTypes;
Default.args = {
  label: 'Input Field',
  type: 'input',
};

export const File = Template.bind({});
File.argTypes = argTypes;
File.args = {
  label: 'File Input Field',
  type: 'file',
  buttonLabel: 'Browse',
};

export const Textarea = Template.bind({});
Textarea.argTypes = argTypes;
Textarea.args = {
  label: 'Textarea Input Field',
  type: 'textarea',
};

export const Dropdown = DropdownTemplate.bind({});
Dropdown.argTypes = argTypes;
Dropdown.args = {
  label: 'Dropdown Input Field',
  type: 'dropdown',
  createOptions: async function() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            label: 'All',
          },
          {
            id: 2,
            label: 'HR Admin',
          },
          {
            id: 3,
            label: 'ESS',
          },
        ]);
      }, 5000);
    });
  },
};

export const PasswordInput = Template.bind({});
PasswordInput.argTypes = argTypes;
PasswordInput.args = {
  label: 'Password Input Field',
  type: 'password',
};

export const CheckboxInput = Template.bind({});
CheckboxInput.argTypes = argTypes;
CheckboxInput.args = {
  label: 'Checkbox Input Field',
  optionLabel: 'check this!',
  type: 'checkbox',
};

export const SwitchInput = Template.bind({});
SwitchInput.argTypes = argTypes;
SwitchInput.args = {
  label: 'Switch Input Field',
  optionLabel: 'switch this!',
  type: 'switch',
};

export const RadioInput = Template.bind({});
RadioInput.argTypes = argTypes;
RadioInput.args = {
  label: 'Radio Input Field',
  optionLabel: 'check this!',
  type: 'radio',
};

export const WithIcon = Template.bind({});
WithIcon.argTypes = argTypes;
WithIcon.args = {
  label: 'Textarea Input Field',
  labelIcon: 'card-text',
  type: 'textarea',
};

export const DateInput = Template.bind({});
DateInput.argTypes = argTypes;
DateInput.args = {
  label: 'Date Input Field',
  type: 'date',
};

export const WithValidation = () => InputFieldValidation;