import { Injectable, signal } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class LoaderService {
  private n = 0;
  loading = signal(false);
  inc(){ if(++this.n>0) this.loading.set(true); }
  dec(){ if(this.n>0 && --this.n===0) this.loading.set(false); }
}
