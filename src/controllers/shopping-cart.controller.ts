// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {
  put,
  get,
  del,
  param,
  requestBody,
  HttpErrors,
  post,
} from '@loopback/rest';
import {repository} from '@loopback/repository';
import {ShoppingCartRepository} from '../repositories';
import {ShoppingCart, ShoppingCartItem} from '../models';
import * as debugFactory from 'debug';
const debug = debugFactory('loopback:example:shopping');

/**
 * Controller for shopping cart
 */
export class ShoppingCartController {
  constructor(
    @repository(ShoppingCartRepository)
    public shoppingCartRepository: ShoppingCartRepository,
  ) {}

  /**
   * Create or update the shopping cart for a given user
   * @param userId User id
   * @param cart Shopping cart
   */
  @put('/shoppingCarts/{userId}')
  async set(
    @param.path.string('userId') userId: string,
    @requestBody({description: 'shopping cart'}) cart: ShoppingCart,
  ) {
    debug('Create shopping cart %s: %j', userId, cart);
    if (userId !== cart.userId) {
      throw new HttpErrors.BadRequest(
        `User id does not match: ${userId} !== ${cart.userId}`,
      );
    }
    await this.shoppingCartRepository.set(userId, cart);
  }

  /**
   * Retrieve the shopping cart by user id
   * @param userId User id
   */
  @get('/shoppingCarts/{userId}')
  async get(@param.path.string('userId') userId: string) {
    debug('Get shopping cart %s', userId);
    const cart = await this.shoppingCartRepository.get(userId);
    debug('Shopping cart %s: %j', userId, cart);
    if (cart == null) {
      throw new HttpErrors.NotFound(
        `Shopping cart not found for user: ${userId}`,
      );
    } else {
      return cart;
    }
  }

  /**
   * Delete the shopping cart by user id
   * @param userId User id
   */
  @del('/shoppingCarts/{userId}')
  async remove(@param.path.string('userId') userId: string) {
    debug('Remove shopping cart %s', userId);
    await this.shoppingCartRepository.delete(userId);
  }

  /**
   * Add an item to the shopping cart for a given user
   * @param userId User id
   * @param cart Shopping cart item to be added
   */
  @post('/shoppingCarts/{userId}/items')
  async addItem(
    @param.path.string('userId') userId: string,
    @requestBody({description: 'shopping cart item'}) item: ShoppingCartItem,
  ) {
    debug('Add item %j to shopping cart %s', item, userId);
    return this.shoppingCartRepository.addItem(userId, item);
  }
}