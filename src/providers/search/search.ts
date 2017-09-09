import { Injectable } from '@angular/core';
import { ApiProvider } from '../api/api';

@Injectable()
export class SearchProvider {

  constructor(private apiProvider: ApiProvider) {
  }

  search(term: string) {
    term = term.trim();
    if (term.startsWith('#')) {
      const search = term.substring(1);
      return this.apiProvider.get(`/search/tags/?search=${search}`);
    } else {
      return this.apiProvider.get(`/search/users/?search=${term}`);
    }
  }

  getLastUsers(){
    return this.apiProvider.get(`/search/users/?search= `);
  }
}
