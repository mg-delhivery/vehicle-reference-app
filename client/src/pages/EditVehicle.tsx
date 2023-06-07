import { Button, Label, Select, Spinner, TextInput } from 'flowbite-react';
import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { createSearchParams, useNavigate, useParams } from 'react-router-dom';

import { editVehicle, fetchVehicle } from '../api/vehicles';
import { Toast } from '../components/Toast';
import Title from '../layout/Title';

interface VehicleParticipantForm extends VehicleDisplay {}

const defaultValues: VehicleDisplay = {
  id: '',
  state: {
    current: '',
    transitions: [],
  },
  name: '',
  uniqueCode: '',
  category: '',
  owner: '',
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

function EditVehicle(props: any) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [vehicle, setVehicle] = useState<VehicleDisplay>(defaultValues);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string>();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VehicleParticipantForm>({
    defaultValues: useMemo(() => vehicle, [vehicle]),
  });

  const onSubmit = async (data: VehicleParticipantForm) => {
    if (!id) {
      console.error('Vehicle id not set.');
      return;
    }

    setIsSubmitting(true);
    setSubmissionError(undefined);

    try {
      await editVehicle(id, data.properties, props.console);

      navigate({
        pathname: '../..',
        search: `?${createSearchParams({
          success: 'true',
          message: 'edited',
        })}`,
      });
    } catch (e) {
      console.error(e);
      setIsSubmitting(false);
      setSubmissionError('Edit failed.');
    }
  };

  useEffect(() => {
    const executeFetchVehicle = async () => {
      const vehicleDisplay = await fetchVehicle(id || '', props.console) as VehicleDisplay;
      setVehicle(vehicleDisplay);
      setIsLoading(false);
    };
    executeFetchVehicle();
  }, [id]);

  useEffect(() => {
    reset(vehicle);
  }, [reset, vehicle]);

  if (!id) {
    return <div>Vehicle not found.</div>;
  }
  return (
    <div id="EditVehicle" className="relative flex flex-col items-center">
      {submissionError && <Toast kind="error">{submissionError}</Toast>}

      <div className="w-full">
        <div className="flex flex-row items-center gap-4 md:gap-6">
          <Title>Edit Vehicle</Title>
        </div>

        {isLoading && (
          <div className="text-center">
            <Spinner size="xl" aria-label="Loading vehicles" />
          </div>
        )}

        {!isLoading && (
          <form
            onSubmitCapture={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div>
              <div className="mb-2 block">
                <Label htmlFor="id" value="ID" />
              </div>
              <TextInput
                id="id"
                type="text"
                disabled={true}
                placeholder={vehicle?.id}
                required={true}
                {...register('id', {})}
              />
            </div>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="name" value="Name" />
              </div>
              <TextInput
                id="name"
                type="text"
                disabled={true}
                placeholder={vehicle?.name}
                required={true}
                {...register('name', {})}
              />
            </div>

            <hr className="my-4" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grow">
                <div className="mb-2 block">
                  <Label htmlFor="properties.availability" value="Available" />
                </div>
                <label className="inline-flex relative items-center cursor-pointer">
                  <input
                    type="checkbox"
                    value=""
                    className="sr-only peer"
                    defaultChecked={vehicle?.properties.availability}
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
                  placeholder={vehicle?.properties.mode}
                  required={true}
                  {...register('properties.mode', {})}
                />
              </div>
              <div className="grow">
                <div className="mb-2 block">
                  <Label
                    htmlFor="properties.operatorId"
                    value="Operator ID *"
                  />
                </div>
                <TextInput
                  id={'properties.operatorId'}
                  type="text"
                  disabled={false}
                  placeholder={vehicle?.properties.operatorId}
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
                  placeholder={vehicle?.properties.payloadCapacity}
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
                  placeholder={vehicle?.properties.registrationNumber}
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
                  placeholder={vehicle?.properties.registrationYear?.toString()}
                  required={false}
                  {...register('properties.registrationYear', {})}
                />
              </div>
            </div>
            <div className="mt-4">
              <span>Required fields denoted by *</span>
            </div>

            <Button type="submit" className="mt-6">
              {!isSubmitting && <span>Save</span>}
              {isSubmitting && (
                <div className="text-center">
                  <Spinner size="xl" aria-label="Saving edits" />
                </div>
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

export default EditVehicle;
