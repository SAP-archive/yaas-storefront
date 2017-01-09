/**
 * [y] hybris Platform
 *
 * Copyright (c) 2000-2016 hybris AG
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of hybris
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with hybris.
 */
'use strict';

angular.module('ds.account')
    /**
     *  Displays basic modal releated for process of customer account deletion.
     *  There is a need just for close operation, everything else is simple message. 
     */
    .controller('DeleteAccountBasicCtrl', ['$scope', '$uibModalInstance', 'success',
        function($scope, $uibModalInstance, success) {

            $scope.success = success;

            $scope.close = function() {
                $uibModalInstance.dismiss('cancel');
            };

    }]);