import {
  ref,
  computed,
  watchEffect,
  onBeforeUnmount,
  WatchStopHandle,
} from 'vue';
import {nanoid} from 'nanoid';
import {injectStrict} from '../utils/injectable';
import {ErrorField, FormAPI, formKey, ModelValue, Rule} from './types';

export default function useField(fieldContext: {
  fieldLabel: string;
  rules: Rule[];
  modelValue: ModelValue;
  onReset: () => Promise<void>;
}) {
  const form = injectStrict<FormAPI>(formKey);
  const cid = ref<string>(nanoid());
  const label = ref<string>(fieldContext.fieldLabel);
  const dirty = ref<boolean>(false);
  const touched = ref<boolean>(false);
  const processing = ref<boolean>(false);
  let watchHandler: WatchStopHandle | undefined;

  const validate = (modelValue: ModelValue, rules: Rule[]) => {
    processing.value = true;
    const allValidations = Promise.all(
      rules.map(func => {
        return new Promise<boolean>((resolve, reject) => {
          Promise.resolve(func(modelValue.value)).then(valid => {
            if (valid === true) {
              resolve(valid);
            } else if (typeof valid === 'string') {
              reject(valid);
            } else {
              reject(
                new Error(
                  `Rules should return a string or true, received '${typeof valid}'`,
                ),
              );
            }
          });
        });
      }),
    );

    return new Promise<ErrorField>((resolve, reject) => {
      allValidations
        .then(() => {
          resolve({
            cid: cid.value,
            errors: [],
          });
        })
        .catch(error => {
          if (typeof error === 'string') {
            resolve({
              cid: cid.value,
              errors: [error],
            });
          } else {
            reject(error);
          }
        })
        .finally(() => {
          processing.value = false;
        });
    });
  };

  const startWatcher = () => {
    watchHandler = watchEffect(
      () => {
        validate(fieldContext.modelValue, fieldContext.rules).then(result => {
          form.addError(result);
        });
      },
      {
        flush: 'post',
      },
    );
  };

  const reset = () => {
    dirty.value = false;
    touched.value = false;
    processing.value = false;
    watchHandler && watchHandler(); // stop the validation watcher
    fieldContext.onReset();
  };

  form.registerField({
    cid,
    label,
    dirty,
    touched,
    processing,
    validate: () => validate(fieldContext.modelValue, fieldContext.rules),
    reset,
  });

  onBeforeUnmount(() => {
    form.unregisterField({
      cid,
      label,
      dirty,
      touched,
      processing,
      validate: () => validate(fieldContext.modelValue, fieldContext.rules),
      reset,
    });
  });

  const hasError = computed(() => {
    return form.searchErrors(cid.value).length > 0;
  });

  const message = computed(() => {
    return hasError.value ? form.searchErrors(cid.value)[0].errors[0] : null;
  });

  return {
    form,
    reset,
    validate,
    hasError,
    message,
    dirty,
    startWatcher,
  };
}