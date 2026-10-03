/* eslint-disable */
// @ts-nocheck
import { Route as rootRouteImport } from './routes/__root'
import { Route as IndexRouteImport } from './routes/index'
import { Route as AppRouteImport } from './routes/app'
import { Route as SearchRouteImport } from './routes/app.leads.search'
import { Route as LeadsRouteImport } from './routes/app.leads'
import { Route as CrmRouteImport } from './routes/app.crm'
import { Route as MapRouteImport } from './routes/app.map'
import { Route as ListsRouteImport } from './routes/app.lists'
import { Route as CampaignsRouteImport } from './routes/app.campaigns'
import { Route as AnalyticsRouteImport } from './routes/app.analytics'
import { Route as AiRouteImport } from './routes/app.ai'
import { Route as ExportsRouteImport } from './routes/app.exports'
import { Route as SettingsRouteImport } from './routes/app.settings'
import { Route as ProfileRouteImport } from './routes/app.profile'
import { Route as LoginRouteImport } from './routes/login'
import { Route as RegisterRouteImport } from './routes/register'
const mk=(r:any,id:string,path:string)=>r.update({id,path,getParentRoute:()=>rootRouteImport} as any)
const IndexRoute=mk(IndexRouteImport,'/','/')
const AppRoute=mk(AppRouteImport,'/app','/app')
const SearchRoute=mk(SearchRouteImport,'/app/leads/search','/app/leads/search')
const LeadsRoute=mk(LeadsRouteImport,'/app/leads','/app/leads')
const CrmRoute=mk(CrmRouteImport,'/app/crm','/app/crm')
const MapRoute=mk(MapRouteImport,'/app/map','/app/map')
const ListsRoute=mk(ListsRouteImport,'/app/lists','/app/lists')
const CampaignsRoute=mk(CampaignsRouteImport,'/app/campaigns','/app/campaigns')
const AnalyticsRoute=mk(AnalyticsRouteImport,'/app/analytics','/app/analytics')
const AiRoute=mk(AiRouteImport,'/app/ai','/app/ai')
const ExportsRoute=mk(ExportsRouteImport,'/app/exports','/app/exports')
const SettingsRoute=mk(SettingsRouteImport,'/app/settings','/app/settings')
const ProfileRoute=mk(ProfileRouteImport,'/app/profile','/app/profile')
const LoginRoute=mk(LoginRouteImport,'/login','/login')
const RegisterRoute=mk(RegisterRouteImport,'/register','/register')
export interface FileRoutesByFullPath{[key:string]:any}
export interface FileRoutesByTo{[key:string]:any}
export interface FileRoutesById{__root__:typeof rootRouteImport}
export interface FileRouteTypes{fileRoutesByFullPath:FileRoutesByFullPath;fullPaths:string;fileRoutesByTo:FileRoutesByTo;to:string;id:'__root__';fileRoutesById:FileRoutesById}
export interface RootRouteChildren{IndexRoute:typeof IndexRoute;AppRoute:typeof AppRoute;SearchRoute:typeof SearchRoute;LeadsRoute:typeof LeadsRoute;CrmRoute:typeof CrmRoute;MapRoute:typeof MapRoute;ListsRoute:typeof ListsRoute;CampaignsRoute:typeof CampaignsRoute;AnalyticsRoute:typeof AnalyticsRoute;AiRoute:typeof AiRoute;ExportsRoute:typeof ExportsRoute;SettingsRoute:typeof SettingsRoute;ProfileRoute:typeof ProfileRoute;LoginRoute:typeof LoginRoute;RegisterRoute:typeof RegisterRoute}
const rootRouteChildren:RootRouteChildren={IndexRoute,AppRoute,SearchRoute,LeadsRoute,CrmRoute,MapRoute,ListsRoute,CampaignsRoute,AnalyticsRoute,AiRoute,ExportsRoute,SettingsRoute,ProfileRoute,LoginRoute,RegisterRoute}
export const routeTree=rootRouteImport._addFileChildren(rootRouteChildren)._addFileTypes<FileRouteTypes>()
import type { getRouter } from './router.tsx'
import type { startInstance } from './start.ts'
declare module '@tanstack/react-start'{interface Register{ssr:true;router:Awaited<ReturnType<typeof getRouter>>;config:Awaited<ReturnType<typeof startInstance.getOptions>>}}
