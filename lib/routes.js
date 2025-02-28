import inflection from 'inflection';
import _ from 'lodash';
import path from 'path';
import { addTrailingSlash } from './utils.js';

export default class Routes {
  static defaultActions = {
    index: 'get',
    new: 'get',
    create: 'post',
    show: 'get',
    edit: 'get',
    update: 'put',
    destroy: 'delete',
  };

  /*
  You have to create the function into the controller to generate the default routes, if they aren't in the file,
  the route will not be created.
  */
  constructor(app, name, options) {
    this.name = options.name || name;
    this.root = options.root || false;
    this.nestedPath = options.nestedPath || false;
    this.base = this.getBase();

    this.id = options.id || this.defaultId();

    this.member = options.member || {};
    this.collection = options.collection || {};
    this.routes = [];
    this.parent = null;
  }

  init(versionsAndActions) {
    this.versionsAndActions = _.cloneDeep(versionsAndActions);

    // Create the custom actions.
    this.customActions(this.collection, false);
    this.customActions(this.member, true);
    const currentPaths = [
      ...Object.values(this.member).flat(),
      ...Object.values(this.collection).flat(),
    ];

    const routes = {};
    for (const version in this.versionsAndActions) {
      const actions = { ...this.versionsAndActions[version] };

      for (const actionName in actions) {
        if (!Routes.defaultActions[actionName]) continue;
        if (currentPaths.includes(actionName)) continue;

        let expressPath = this.path(actionName);
        if (!expressPath) continue;
        expressPath += '.:format?';

        const method = Routes.defaultActions[actionName.toLowerCase()];

        const route = {
          actionName,
          method,
          path: expressPath,
          callbacks: {
            [version]: this.callback(actions, actionName),
          },
        };

        if (routes[actionName] === undefined) {
          routes[actionName] = route;
        } else {
          routes[actionName] = _.merge(routes[actionName], route);
        }
      }
    }
    for (const route of Object.values(routes)) {
      this.store(route.actionName, route.method, route.path, route.callbacks);
    }
  }

  //Return the name of the controller as default ID
  defaultId() {
    return `${inflection.singularize(this.name)}_id`;
  }

  store(action, method, expressPath, callbacks) {
    this.routes.push({
      action,
      method,
      path: expressPath,
      callbacks,
    });
  }

  //Generate the action's path
  path(action) {
    const base = addTrailingSlash(this.base);
    const memberActions = [ 'show', 'edit', 'update', 'destroy' ]
    const collectionActions = [ 'new', 'edit' ]

    const isMember = memberActions.includes(action)
    const isCollection = collectionActions.includes(action)
    
    const idStr = isMember ? `:${this.id}` : ''
    const actionStr = isCollection ? action : ''
    
    return `${base}${idStr}${actionStr}`;
  }

  //If the controller is nested to another controller, We change the base of the url.
  getBase() {
    return this.nestedPath?.length > 0
      ? `${this.nestedPath}/${this.name}`
      : `/${this.root ? '' : this.name}`;
  }

  //Set configuration to create the nested controller
  async nest(callback, isResource = true) {
    const parent = this.parent;
    const prev = parent.nestedPath;
    const prevSubfolder = parent.subfolder;

    //Change the base to the show route, so the base will be '/sessions/:session'
    parent.nestedPath = isResource ? this.path('show') : this.path('index');

    if (parent.subfolder) {
      parent.subfolder = path.join(parent.subfolder, this.name);
    } else {
      parent.subfolder = this.name;
    }

    await callback.apply(this);

    parent.subfolder = prevSubfolder || null;
    parent.nestedPath = prev || null;
  }

  customActions(methods, member) {
    if (_.isEmpty(methods)) return;
    const routes = {};

    for (const version in this.versionsAndActions) {
      const actions = this.versionsAndActions[version];
      for (const method in methods) {
        for (const actionName of methods[method]) {
          let expressPath = this.base;
          if (!Routes.defaultActions[actionName]) {
            expressPath = addTrailingSlash(expressPath);
            expressPath += member ? `:${this.id}/${actionName}` : actionName;
          } else if (member) {
            expressPath += `/:${this.id}`;
          }

          const route = {
            actionName,
            method,
            path: expressPath,
            callbacks: {
              [version]: this.callback(actions, actionName),
            },
          };

          if (routes[actionName] === undefined) {
            routes[actionName] = route;
          } else {
            routes[actionName] = _.merge(routes[actionName], route);
          }
        }
      }
    }
    for (const route of Object.values(routes)) {
      this.store(route.actionName, route.method, route.path, route.callbacks);
    }
  }

  callback(actions, action) {
    const before = actions.options?.before;
    return {
      controller: actions[action],
      before:
        before && action in before ? [].concat(before[action]) : undefined,
    };
  }
}
