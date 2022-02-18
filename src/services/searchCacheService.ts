import { getConnection, getRepository } from 'typeorm';
import { SearchCache } from '../entity/searchCache';

class SearchCacheService {
  public async getsearchCache(
    name: string,
    year: string,
    page: number
  ): Promise<SearchCache | undefined> {
    return getConnection()
      .getRepository(SearchCache)
      .createQueryBuilder('searchcache')
      .where(
        'searchcache.nameFilter = :name AND searchcache.yearFilter = :year AND searchcache.page = :page',
        {
          name,
          year,
          page,
        }
      )
      .getOne();
  }

  public async createSearchCache(
    nameFilter: string,
    yearFilter: string,
    page: number,
    totalResults: number
  ): Promise<number> {
    const newCache = getRepository(SearchCache).create({
      nameFilter,
      yearFilter,
      page,
      date: new Date(),
      totalResults,
    });
    const result = await getRepository(SearchCache).save(newCache);
    return result.id;
  }

  public async updateSearchCache(search: SearchCache): Promise<number> {
    const entity = await getRepository(SearchCache).findOne(search.id);
    if (entity) {
      getRepository(SearchCache).merge(entity, {
        ...search,
        date: new Date(),
      });
      const result = await getRepository(SearchCache).save(entity);
      return result.id;
    }

    throw new Error('Not SearchCache found');
  }
}

const searchCacheService = new SearchCacheService();

export default searchCacheService;
