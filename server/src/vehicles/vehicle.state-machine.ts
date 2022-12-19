import { NotFoundException } from '@nestjs/common';
import { NotFoundError } from 'rxjs';
import { State } from '../common/models/state.model';

export class VehicleStateMachine {
  private states: State[] = [
    {
      current: 'onboarding:onboarding',
      transitions: ['active:active'],
    },
    {
      current: 'active:active',
      transitions: ['inactive:inactive'],
    },
    {
      current: 'inactive:inactive',
      transitions: ['inactive:dead'],
    },
    {
      current: 'inactive:dead',
      transitions: [],
    },
  ];

  public getState(stateName: string): State {
    const state = this.states.find(({ current: name }) => {
      return name === stateName;
    });

    if (state) {
      return state;
    }

    throw new NotFoundException();
  }
}
