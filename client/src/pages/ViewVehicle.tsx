import {
  Button,
  Label,
  Spinner,
  TextInput,
  ToggleSwitch,
} from 'flowbite-react';
import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

import { fetchVehicle } from '../api/vehicles';
import { VehicleStateDisplay } from '../components/VehicleState';
import Title from '../layout/Title';

interface VehicleParticipantForm extends VehicleDisplay {}

const defaultValues: VehicleDisplay = {
  id: '',
  state: '',
  name: '',
  uniqueCode: '',
  category: '',
  owner: '',
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
      <div className="flex flex-row items-center gap-4 md:gap-6">
        <Title>{vehicle?.name}</Title>
        {!isLoading && (
          <VehicleStateDisplay size="lg" rawState={vehicle.state} />
        )}
      </div>
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
          <hr className="my-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grow">
              <div className="mb-2 block">
                <Label htmlFor="properties.availability" value="Available" />
              </div>
              <ToggleSwitch
                id="properties.availability"
                label=""
                checked={!!vehicle.properties.availability}
                onChange={() => null}
              />
            </div>
            <div className="grow">
              <div className="mb-2 block">
                <Label htmlFor="properties.fuelType" value="Fuel Type" />
              </div>
              <TextInput
                id={'properties.fuelType'}
                type="text"
                disabled={true}
                placeholder={vehicle?.properties.fuelType}
                required={true}
                {...register('properties.fuelType', {})}
              />
            </div>
            <div className="grow">
              <div className="mb-2 block">
                <Label htmlFor="properties.mode" value="Mode" />
              </div>
              <TextInput
                id={'properties.mode'}
                type="text"
                disabled={true}
                placeholder={vehicle?.properties.mode}
                required={true}
                {...register('properties.mode', {})}
              />
            </div>
            <div className="grow">
              <div className="mb-2 block">
                <Label htmlFor="properties.operatorId" value="Operator ID" />
              </div>
              <TextInput
                id={'properties.operatorId'}
                type="text"
                disabled={true}
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
                disabled={true}
                placeholder={vehicle?.properties.payloadCapacity}
                required={true}
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
                disabled={true}
                placeholder={vehicle?.properties.registrationNumber}
                required={true}
                {...register('properties.registrationNumber', {})}
              />
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
                type="text"
                disabled={true}
                placeholder={vehicle?.properties.registrationYear?.toString()}
                required={true}
                {...register('properties.registrationYear', {})}
              />
            </div>
          </div>
          <hr className="my-4" />
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
