import {beforeEach,describe,expect,it} from 'vitest';import {getData,seed} from '../service';
beforeEach(()=>localStorage.clear());describe('analytics',()=>{it('creates deterministic demo data',()=>{seed();const a=getData();seed();expect(getData()).toEqual(a);expect(a.registrations).toHaveLength(12);expect(a.levels).toHaveLength(3)})});
