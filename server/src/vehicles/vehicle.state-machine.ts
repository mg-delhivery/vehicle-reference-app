import { NotFoundException } from '@nestjs/common';
import { NotFoundError } from 'rxjs';
import { State } from '../common/models/state.model';

export class VehicleStateMachine {
  private states: State[] = [
    {
      name: 'onboarding:onboarding',
      transitions: ['active:active'],
    },
    {
      name: 'active:active',
      transitions: ['inactive:inactive'],
    },
    {
      name: 'inactive:inactive',
      transitions: ['inactive:dead'],
    },
    {
      name: 'inactive:dead',
      transitions: [],
    },
  ];

  public getState(stateName: string): State {
    const state = this.states.find(({ name }) => {
      return name === stateName;
    });

    if (state) {
      return state;
    }

    throw new NotFoundException();
  }
}
