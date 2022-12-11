/* tslint:disable */
/* eslint-disable */
/**
 * Chattly Service
 * This service provides endpoints for all `chattly` related interactions
 *
 * OpenAPI spec version: 1.0.0
 * Contact: fatai@mail.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
/**
 * 
 * @export
 * @interface InitiateSingleChatConnectionDto
 */
export interface InitiateSingleChatConnectionDto {
    /**
     * New connection username
     * @type {string}
     * @memberof InitiateSingleChatConnectionDto
     */
    newConnectUsername: string;
    /**
     * Optional chat message. A default `greeting` message will be sent if not provided
     * @type {string}
     * @memberof InitiateSingleChatConnectionDto
     */
    initialChatMessage?: string;
}