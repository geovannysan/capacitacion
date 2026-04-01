import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import {
  CharactersInterface,
  RickAndMortyResponse,
} from './interfaces/caharacter-repository.interface';
import { JWT_CONFIG, TOKENSORM } from 'src/common/types/type-orm';
import { ConfigService } from '@nestjs/config';
import { CreateCharactersDto, ResponseCharactersDto } from './dtos';

@Injectable()
export class CharactersService {
  constructor(
    private readonly config: ConfigService,
    private readonly httpService: HttpService,
    @Inject(TOKENSORM.CHARACTER_REPOSITORY)
    private readonly characterRepo: CharactersInterface,
  ) { }
  async sync(): Promise<ResponseCharactersDto[]> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get<RickAndMortyResponse>(this.config.get(JWT_CONFIG.RICKMORTY_URL)),
      );
      const characters = await this.characterRepo.createManyCharacters(data.results);
      return characters;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Hubo un error por favor intente mas tarde');
    }
  }
  async createCharacter(character: Partial<CreateCharactersDto>) {
    try {
      const characterName = await this.characterRepo.findByNameCharacter(character.name);
      if (characterName) throw new BadRequestException('Personaje con el mismo nombre ya existe');
      return await this.characterRepo.createCharacter(character);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Hubo un error por favor intente mas tarde');
    }
  }
  async findAllCharacters(): Promise<ResponseCharactersDto[]> {
    try {
      const charcater = await this.characterRepo.findAllCharacters();

      return charcater;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Hubo un error por favor intente mas tarde');
    }
  }
  async findByIdCharacter(id: number): Promise<ResponseCharactersDto> {
    try {
      const character = await this.characterRepo.findByIdCharacter(id);
      return character;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Hubo un error por favor intente mas tarde');
    }
  }
  async deleteCharacter(id: number): Promise<ResponseCharactersDto[]> {
    try {
      const character = await this.characterRepo.findByIdCharacter(id);
      if (!character) throw new NotFoundException('Personaje no encontrado');
      return await this.characterRepo.deleteCharacter(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Hubo un error por favor intente mas tarde');
    }
  }
  async updateCharacter(
    id: number,
    character: Partial<CreateCharactersDto>,
  ): Promise<ResponseCharactersDto> {
    try {
      const characterById = await this.characterRepo.findByIdCharacter(id);
      if (!characterById) throw new NotFoundException('Personaje no encontrado');
      const characterName = await this.characterRepo.findByNameCharacter(character.name);
      if (characterName == null || characterName.id === id) {
        return await this.characterRepo.updateCharacter(id, character);
      }
      throw new BadRequestException('Personaje con el mismo nombre ya existe');
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Hubo un error por favor intente mas tarde');
    }
  }
}
