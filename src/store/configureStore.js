import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { createHashHistory } from "history";
import { routerMiddleware, routerActions } from "react-router-redux";
import { createLogger } from "redux-logger";
import rootReducer from "../redux-reducers";
import * as annotationsActions from "../redux-actions/annotations";
import * as authActions from "../redux-actions/auth";
import * as imageActions from "../redux-actions/image";
import * as labelsActions from "../redux-actions/labels";
import * as projectActions from "../redux-actions/project";
import * as sequenceActions from "../redux-actions/sequence";
import * as typesActions from "../redux-actions/types";

export const history = createHashHistory();

export const configureStore = initialState => {
  // Redux Configuration
  const middleware = [];
  const enhancers = [];

  // Thunk Middleware
  middleware.push(thunk);

  // Logging Middleware
  const logger = createLogger({
    level: "info",
    collapsed: true
  });
  middleware.push(logger);

  // Router Middleware
  const router = routerMiddleware(history);
  middleware.push(router);
  // Redux DevTools Configuration
  const actionCreators = {
    ...routerActions,
    ...annotationsActions,
    ...authActions,
    ...imageActions,
    ...labelsActions,
    ...projectActions,
    ...sequenceActions,
    ...typesActions
  };
  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  /* eslint-disable no-underscore-dangle */
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Options: http://zalmoxisus.github.io/redux-devtools-extension/API/Arguments.html
      actionCreators
    })
    : compose;
  /* eslint-enable no-underscore-dangle */

  // Apply Middleware & Compose Enhancers
  enhancers.push(applyMiddleware(...middleware));
  const enhancer = composeEnhancers(...enhancers);

  // Create Store
  const store = createStore(rootReducer, initialState, enhancer);
  // if (module.hot) {
  //   module.hot.accept('../reducers', () =>
  //     store.replaceReducer(require('../reducers')) // eslint-disable-line global-require
  //   );
  // }

  return store;
};
