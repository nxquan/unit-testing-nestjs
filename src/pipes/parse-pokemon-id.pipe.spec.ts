import { BadRequestException } from '@nestjs/common';
import { ParsePokemonIdPipe } from './parse-pokemon-id.pipe';

describe('ParsePokemonIdPipe', () => {
  let pipe: ParsePokemonIdPipe;

  beforeEach(() => {
    pipe = new ParsePokemonIdPipe();
  });

  it('should be defined', () => {
    expect(new ParsePokemonIdPipe()).toBeDefined();
  });

  it('Should throw error for non-number', () => {
    const value = () => pipe.transform('hello', { type: 'query' });

    expect(value).toThrow(BadRequestException);
  });

  it(`should throw error if number less than 1`, () => {
    const value = () => pipe.transform(`-34`, { type: 'query' });
    expect(value).toThrow(BadRequestException);
  });

  it(`should throw error if number greater than 151`, () => {
    const value = () => pipe.transform(`200`, { type: 'query' });
    expect(value).toThrow(BadRequestException);
  });

  it(`should return number if between 1 and 151`, () => {
    const value = () => pipe.transform(`5`, { type: 'query' });
    expect(value()).toBe(5);
  });
});
