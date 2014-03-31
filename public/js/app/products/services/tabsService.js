'use strict';

angular.module('hybris.bs&d.newborn.products.services.products')
    .service('TabsService', ['$state', '$rootScope',
        function ($state, $rootScope) {

            var defaultTabs = [{
                    id: 'products',
                    label: 'Product List',
                    url: $state.href('base.products.list'),
                    stateName: 'base.products.list',
                    active: $state.is('base.products.list'),
                    closeable: false
                }, {
                    id: 'newproduct',
                    label: 'Create Product',
                    url: $state.href('base.products.new'),
                    stateName: 'base.products.new',
                    active: $state.is('base.products.new'),
                    closeable: false
                }];

            this.tabs = defaultTabs;

            this.getTabs = function() {
                return this.tabs;
            };

            this.activateLastTab = function() {
                var lastTab = this.tabs[this.tabs.length -1];
                $state.go(lastTab.stateName, lastTab.stateParams);
            };

            this.getTabIndex = function(id) {
                var tabIndex = -1;
                for(var index in this.tabs) {
                    if (this.tabs[index].id === id) {
                        tabIndex = index;
                    }
                }
                return tabIndex;
            };

            this.getTab = function(id) {
                return this.tabs[this.getTabIndex(id)];
            };

            this.addTab = function(tabConfig) {
                this.tabs.push(tabConfig);
            };

            this.removeTab = function(tabConfig) {
                var tabIndex = this.getTabIndex(tabConfig.id),
                    tab = this.tabs[tabIndex];
                if (tab && this.tabs.length > 1) {
                    this.tabs.splice(tabIndex, 1);
                }
                this.activateLastTab();
            };

            this.removeTabForState = function(stateName, stateParams) {
                for(var index in this.tabs) {
                    if (this.tabs[index].stateName === stateName && angular.equals(this.tabs[index].stateParams || {}, stateParams || {})) {
                        this.tabs.splice(index, 1);
                    }
                }
            };

            this.setActive = function() {
                angular.forEach(this.tabs, function(ctab) {
                    ctab.active = $state.is(ctab.stateName);
                });
            };

            var self = this;
            var scsHandle = $rootScope.$on('$stateChangeSuccess', function() {
                self.setActive();
            });

            $rootScope.$on('$destroy', function() {
                scsHandle();
            });

        }
    ]);