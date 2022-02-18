import axios, { AxiosInstance, AxiosResponse } from 'axios';
import OmdbMovies from './omdbMovies';
import { get } from '../helper';
import createError from 'http-errors';
export default class OmdbClient {
  client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: 'http://www.omdbapi.com',
      timeout: 3000,
    });
  }

  public async findMovies(
    nameFilter: string,
    yearFilter: string,
    page: number
  ): Promise<OmdbMovies> {
    if (!nameFilter || !nameFilter.trim()) {
      throw createError(400, 'Name filter cannot be null or blank');
    }

    // Prepare the request
    const url = '/';
    const params = { s: nameFilter, y: yearFilter, page, apikey: '5eec5adc' };

    // Send the request
    try {
      const response = await this.client.get(url, { params });
      return this.deserializeFindResponse(response);
    } catch (error) {
      throw error;
    }
  }

  private deserializeFindResponse(response: AxiosResponse) {
    if (get(response, 'data.Response') === 'False') {
      throw createError(400, get(response, 'data.Error'));
    }
    return OmdbMovies.fromJson(JSON.stringify(response.data));
  }
}
