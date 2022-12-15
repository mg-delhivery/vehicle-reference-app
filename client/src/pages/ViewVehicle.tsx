import { Button, Label, Spinner, TextInput } from 'flowbite-react';
import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

import { fetchVehicle } from '../api/vehicles';
import Title from '../layout/Title';

interface VehicleParticipantForm extends VehicleDisplay {}

const defaultValues: VehicleDisplay = {
  id: '',
  state: '',
  name: '',
  properties: {},
  createdBy: '',
  createdAt: '',
  updatedAt: '',
  updatedBy: '',
};

function ViewVehicle() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [vehicle, setVehicle] = useState<VehicleDisplay>(defaultValues);
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VehicleParticipantForm>({
    defaultValues: useMemo(() => vehicle, [vehicle]),
  });
  const onSubmit = (data: VehicleParticipantForm) => console.log(data);
  console.log(errors);

  useEffect(() => {
    const executeFetchVehicle = async () => {
      const vehicleDisplay = await fetchVehicle(id || '');
      setVehicle(vehicleDisplay);
      setIsLoading(false);
    };
    executeFetchVehicle();
  }, []);

  useEffect(() => {
    reset(vehicle);
  }, [vehicle]);

  if (!id) {
    return <div>Vehicle not found.</div>;
  }
  return (
    <div id="ViewVehicle">
      <Title>{vehicle?.name}</Title>
      {isLoading && (
        <div className="text-center">
          <Spinner size="xl" aria-label="Loading vehicles" />
        </div>
      )}
      {!isLoading && (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
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
              id={'name'}
              type="text"
              disabled={true}
              placeholder={vehicle?.name}
              required={true}
              {...register('name', {})}
            />
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="grow">
              <div className="mb-2 block">
                <Label htmlFor="state" value="State" />
              </div>
              <TextInput
                id={'state'}
                type="text"
                disabled={true}
                placeholder={vehicle?.state}
                required={true}
                {...register('state', {})}
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="grow">
              <div className="mb-2 block">
                <Label htmlFor="createdAt" value="Created" />
              </div>
              <TextInput
                id={'createdAt'}
                type="text"
                disabled={true}
                placeholder={vehicle?.createdAt}
                required={true}
                {...register('createdAt', {})}
              />
            </div>

            <div className="grow">
              <div className="mb-2 block">
                <Label htmlFor="createdBy" value="Created By" />
              </div>
              <TextInput
                id={'createdBy'}
                type="text"
                disabled={true}
                placeholder={vehicle?.createdBy}
                required={true}
                {...register('createdBy', {})}
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="grow">
              <div className="mb-2 block">
                <Label htmlFor="updatedAt" value="Last Updated" />
              </div>
              <TextInput
                id={'updatedAt'}
                type="text"
                disabled={true}
                placeholder={vehicle?.updatedAt}
                required={true}
                {...register('updatedAt', {})}
              />
            </div>

            <div className="grow">
              <div className="mb-2 block">
                <Label htmlFor="updatedBy" value="Updated By" />
              </div>
              <TextInput
                id={'updatedBy'}
                type="text"
                disabled={true}
                placeholder={vehicle?.updatedBy}
                required={true}
                {...register('updatedBy', {})}
              />
            </div>
          </div>

          <Button type="button" onClick={() => navigate('edit')}>
            Edit
          </Button>
        </form>
      )}
    </div>
  );
}

export default ViewVehicle;
