import { Test, TestingModule } from '@nestjs/testing';
import { PokemonService } from './pokemon.service';
import { HttpService } from '@nestjs/axios';

import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { createMock, DeepMocked } from '@golevelup/ts-jest';

describe('PokemonService', () => {
  let pokemonService: PokemonService;
  let httpService: DeepMocked<HttpService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PokemonService,
        {
          provide: HttpService,
          useValue: createMock<HttpService>(),
        },
      ],
    })
      // .useMocker(createMock)
      .compile();

    pokemonService = module.get<PokemonService>(PokemonService);
    httpService = module.get(HttpService);
  });

  it('should be defined', () => {
    expect(pokemonService).toBeDefined();
  });

  describe('getPokemon', () => {
    it('pokemon ID less than 1 should throw error', async () => {
      const getPokemon = pokemonService.getPokemon(0);

      await expect(getPokemon).rejects.toBeInstanceOf(BadRequestException);
    });

    it('pokemon ID greater than 151 should throw error', async () => {
      const getPokemon = pokemonService.getPokemon(152);

      await expect(getPokemon).rejects.toBeInstanceOf(BadRequestException);
    });

    it('Valid pokemon id to return the pokemon name', async () => {
      httpService.axiosRef.mockResolvedValueOnce({
        data: {
          species: { name: `bulbasaur` },
        },
        headers: {},
        config: { url: '' },
        status: 200,
        statusText: '',
      });

      const pokemon = await pokemonService.getPokemon(1);

      expect(pokemon).toBe('bulbasaur');
    });

    it('if Pokemon API response unexpectedly changes, throw an error', async () => {
      httpService.axiosRef.mockResolvedValueOnce({
        data: `Unexpected data`,
        headers: {},
        config: { url: '' },
        status: 200,
        statusText: '',
      });

      const getPokemon = pokemonService.getPokemon(1);

      await expect(getPokemon).rejects.toBeInstanceOf(
        InternalServerErrorException,
      );
    });
  });
});
