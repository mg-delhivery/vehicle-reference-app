import { OS1Toast } from '@os1-platform/console-ui-react';
import {
  Button,
  Label,
  Select,
  Spinner,
  TextInput,
  Toast,
} from 'flowbite-react';
import React, { useState, memo, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom';

import { createVehicle } from '../api/vehicles';
import Title from '../layout/Title';

function CreateVehicle(props: any) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [toastMsg, setToastMsg] = useState<string>();

  const defaultValues: VehicleDisplay = {
    id: '',
    state: {
      current: '',
      transitions: [],
    },
    name: '',
    uniqueCode: '',
    owner: sessionStorage.getItem("appOwnerId") as string,
    properties: {},
    createdBy: '',
    createdAt: {
      epoch: 0,
      display: '',
    },
    updatedAt: {
      epoch: 0,
      display: '',
    },
    updatedBy: '',
  };  

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VehicleParticipantForm>({
    defaultValues,
  });

  useEffect(() => {
    if (searchParams.has('success')) {
      const message = searchParams.get('message');

      if (message === 'created') {
      //  if (window && window?.name){
      //   const event = JSON.parse(window?.name)
        //console.log(event)
        //setToastMsg(`name : ${event.data.name}, owner: ${event.data.owner}, unique Code: ${event.data.uniqueCode} `);
        setIsSubmitting(false);
        searchParams.delete('success');
        searchParams.delete('message');
        setSearchParams(searchParams);
       //}
       }
     }
  }, [searchParams, setSearchParams ]);

  useEffect(()=>{
    setTimeout(() => {
      setToastMsg(undefined);
    }, 10000);
  }, [toastMsg])

  const onSubmit = useCallback((async (data: VehicleParticipantForm) => {
    setIsSubmitting(true);
    setSubmissionError(undefined);

    try {
      await createVehicle(data, props.console);
    navigate({
      pathname: '/vehicles/create',
      search: `?${createSearchParams({
        success: 'true',
        message: 'created',
      })}`,
    });
    } catch (e) {
      console.error(e);
      setIsSubmitting(false);
      setSubmissionError('Vehicle creation failed.');
    }
  }), [props.console]);
  
  const toastConfig = {
    bgColor: 'green',
    message: toastMsg || '',
    timeout: 10,
    icon: 'info',
    closeButton: true,
  };

  return (
    <>
      {toastMsg && (
        <OS1Toast
          elementId={'toastElement'}
          toastConfig={toastConfig}
        />
      )}
    <div
      id="CreateVehicle"
      className="relative flex flex-col items-center mt-5"
    >
      <div className="w-full">
        <div className="flex flex-row items-center gap-4 md:gap-6">
          <Title>Create Vehicle</Title>
        </div>

        <form
          //onSubmitCapture={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <div className="mb-2 block">
              <Label htmlFor="name" value="Name" />
            </div>
            <TextInput
              id="name"
              type="text"
              disabled={false}
              placeholder=""
              required={true}
              {...register('name', {})}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* <div className="grow">
              <div className="mb-2 block">
                <Label htmlFor="category" value="Category" />
              </div>
              <TextInput
                id="category"
                type="text"
                disabled={false}
                placeholder=""
                required={false}
                {...register('category', {})}
              />
            </div> */}
            <div className="grow">
              <div className="mb-2 block">
                <Label htmlFor="uniqueCode" value="Code (unique)" />
              </div>
              <TextInput
                id="uniqueCode"
                type="text"
                disabled={false}
                placeholder=""
                required={true}
                {...register('uniqueCode', {})}
              />
            </div>

            <div className="grow">
              <div className="mb-2 block">
                <Label htmlFor="owner" value="Owner" />
              </div>
              <TextInput
                id="owner"
                type="text"
                disabled={true}
                placeholder="tenants:9f944ddf-6d6c-488c-918e-392cb53494c6"
                required={true}
                {...register('owner', {})}
              />
            </div>
          </div>
          <p className="mt-2 text-xs">
            Note: you won't be able to change the above items later.
          </p>

          <hr className="my-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grow">
              <div className="mb-2 block">
                <Label htmlFor="properties.availability" value="Available" />
              </div>
              <label className="inline-flex relative items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  value=""
                  defaultChecked={true}
                  {...register('properties.availability', {})}
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="grow">
              <div className="mb-2 block">
                <Label htmlFor="properties.fuelType" value="Fuel Type *" />
              </div>
              <Select
                id={'properties.fuelType'}
                required={true}
                {...register('properties.fuelType', {})}
              >
                <option>CNG</option>
                <option>Electric</option>
                <option>Gasoline</option>
                <option>Diesel</option>
              </Select>
            </div>
            <div className="grow">
              <div className="mb-2 block">
                <Label htmlFor="properties.mode" value="Mode *" />
              </div>
              <TextInput
                id={'properties.mode'}
                type="text"
                disabled={false}
                placeholder=""
                required={true}
                {...register('properties.mode', {})}
              />
            </div>
            <div className="grow">
              <div className="mb-2 block">
                <Label htmlFor="properties.operatorId" value="Operator ID *" />
              </div>
              <TextInput
                id={'properties.operatorId'}
                type="text"
                disabled={false}
                placeholder=""
                required={true}
                {...register('properties.operatorId', {})}
              />
            </div>
            <div className="grow">
              <div className="mb-2 block">
                <Label
                  htmlFor="properties.payloadCapacity"
                  value="Payload Capacity"
                />
              </div>
              <TextInput
                id={'properties.payloadCapacity'}
                type="text"
                disabled={false}
                placeholder=""
                required={false}
                {...register('properties.payloadCapacity', {})}
              />
            </div>
            <div className="grow">
              <div className="mb-2 block">
                <Label
                  htmlFor="properties.registrationNumber"
                  value="Registration Number"
                />
              </div>
              <TextInput
                id={'properties.registrationNumber'}
                type="text"
                disabled={false}
                placeholder=""
                required={false}
                {...register('properties.registrationNumber', {
                  pattern: /^[a-zA-Z0-9]{5,25}$/i,
                })}
              />
              {errors.properties?.registrationNumber &&
                errors.properties?.registrationNumber.type === 'pattern' && (
                  <p className="mt-2 text-xs text-red-700">
                    Must be alphanumeric with 5-25 characters.
                  </p>
                )}
            </div>
            <div className="grow">
              <div className="mb-2 block">
                <Label
                  htmlFor="properties.registrationNumber"
                  value="Registration Year"
                />
              </div>
              <TextInput
                id={'properties.registrationYear'}
                type="number"
                disabled={false}
                placeholder=""
                required={false}
                {...register('properties.registrationYear', {})}
              />
            </div>
          </div>
          <div className="mt-4">
            <span>Required fields denoted by *</span>
          </div>

          <Button type="submit" className="mt-6" disabled={isSubmitting}>
            {!isSubmitting && <span>Create</span>}
            {isSubmitting && (
              <div className="text-center">
                <Spinner size="xl" aria-label="Saving new vehicle" />
              </div>
            )}
          </Button>
        </form>
      </div>
    </div>
    </>
  );
}

export default memo(CreateVehicle);
