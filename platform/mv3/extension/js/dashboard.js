/*******************************************************************************

    uBlock Plus+ - an original-first MV3 fork
    Based on uBlock Origin upstream sources
    Copyright (C) 2014-present Raymond Hill
    Modifications Copyright (C) 2026-present uBlock Plus+ contributors

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see {http://www.gnu.org/licenses/}.

    Home: https://github.com/gorhill/uBlock
*/

import { dom, qs$ } from './dom.js';
import {
    localRead, localRemove, localWrite,
    runtime,
    webextFlavor,
} from './ext.js';
import { faIconsInit } from './fa-icons.js';
import { i18n } from './i18n.js';

/******************************************************************************/

dom.body.dataset.platform = webextFlavor;

{
    const manifest = runtime.getManifest();
    dom.text('#aboutNameVer', `${manifest.name} ${manifest.version}`);
}

dom.attr('a', 'target', '_blank');

function selectPane(pane) {
    if ( pane === 'txa-cloud' ) { pane = 'txaCloud'; }
    const knownPane = Array.from(document.querySelectorAll('.tabButton[data-pane]'))
        .some(button => button.dataset.pane === pane);
    if ( knownPane === false ) { return false; }
    dom.body.dataset.pane = pane;
    if ( pane === 'settings' ) {
        localRemove('dashboard.activePane');
    } else {
        localWrite('dashboard.activePane', pane);
    }
    return true;
}

function selectHashPane() {
    let hash = self.location.hash.slice(1);
    if ( hash === 'txa-cloud' ) { hash = 'txaCloud'; }
    return selectPane(hash);
}

dom.on('#dashboard-nav', 'click', '.tabButton', ev => {
    const pane = ev.target.closest('.tabButton')?.dataset.pane;
    if ( selectPane(pane) ) { self.location.hash = pane; }
});

self.addEventListener('hashchange', selectHashPane);

localRead('dashboard.activePane').then(pane => {
    if ( selectHashPane() ) { return; }
    if ( typeof pane !== 'string' ) { return; }
    selectPane(pane);
});

// Update troubleshooting on-demand
const tsinfoTarget = qs$('[data-i18n="supportS5H"] + pre, [data-i18n="supportS5H"] ~ pre, section[data-pane="about"] pre');
if ( tsinfoTarget ) {
    const tsinfoObserver = new IntersectionObserver(entries => {
        if ( entries.every(a => a.isIntersecting === false) ) { return; }
        import('./troubleshooting.js').then(module => {
            return module.getTroubleshootingInfo();
        }).then(config => {
            tsinfoTarget.textContent = config;
        });
    });
    tsinfoObserver.observe(tsinfoTarget);
}

const btnDashboardRate = qs$('#btnDashboardRate');
if ( btnDashboardRate ) {
    btnDashboardRate.addEventListener('click', () => {
        const extId = chrome.runtime?.id;
        const storeUrl = (extId && !extId.startsWith('temporary'))
            ? `https://chromewebstore.google.com/detail/${extId}/reviews`
            : 'https://chromewebstore.google.com/';
        if ( typeof browser.tabs?.create === 'function' ) {
            browser.tabs.create({ url: storeUrl });
        } else {
            window.open(storeUrl, '_blank');
        }
    });
}

/******************************************************************************/

export function nodeFromTemplate(templateId, nodeSelector) {
    const template = qs$(`template#${templateId}`);
    const fragment = template.content.cloneNode(true);
    const node = nodeSelector !== undefined
        ? qs$(fragment, nodeSelector)
        : fragment.firstElementChild;
    faIconsInit(node);
    i18n.render(node);
    return node;
}

/******************************************************************************/

export function hashFromIterable(iter) {
    if ( Boolean(iter) === false ) { return ''; }
    return Array.from(iter).sort().join('\n');
}

/******************************************************************************/
