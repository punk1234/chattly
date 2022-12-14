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
 * @interface UpdateUserDto
 */
export interface UpdateUserDto {
    /**
     * 
     * @type {string}
     * @memberof UpdateUserDto
     */
    chatDisplayName?: string;
    /**
     * 
     * @type {string}
     * @memberof UpdateUserDto
     */
    imageURL?: string;
    /**
     * User biography (information about user)
     * @type {string}
     * @memberof UpdateUserDto
     */
    bio?: string;
}
