# import-to-require package

Select the line (or lines) with the 'import' ES6 syntax and press ctrl+alt+m to turn it into a line with 'require' ES5 syntax.

You can select multiple lines to modify several import lines at a time.<br />
But doesn't support multi-cursors.

Installation:
`apm install import-to-require`

### Support those kinds of imports:

import moment from "moment";<br />
=> const moment = require("moment");<br />

import React from "react";<br />
=> const React = require("react");<br />

import text from "../../helpers/text";<br />
=> const text = require("../../helpers/text");<br />

import Button from "../../elements/buttons/Button";<br />
=> const Button = require("../../elements/buttons/Button");<br />

import { Container1 } from "next/app";<br />
=> const Container1 = require("next/app").Container1;<br />

import { checkmark } from "../../elements/utils";<br />
=> const checkmark = require("../../elements/utils").checkmark;<br />

import { IntlProvider, addLocaleData } from "react-intl";<br />
=> const IntlProvider = require("react-intl").IntlProvider;<br />
=> const addLocaleData = require("react-intl").addLocaleData;<br />

import { close as crossIcon } from "react-icons-kit/ionicons/close";<br />
=> const crossIcon = require("react-icons-kit/ionicons/close").close;<br />

import { close as crossIcon, open as openIcon } from "react-icons-kit/ionicons/close";<br />
=> const crossIcon = require("react-icons-kit/ionicons/close").close;<br />
=> const openIcon = require("react-icons-kit/ionicons/close").open;<br />

import App, { Container, connect, coon as alias } from "next/app";<br />
=> const App = require(next/app);<br />
=> const Container = require("next/app").Container;<br />
=> const connect = require("next/app").connect;<br />
=> const alias = require("next/app").coon;<br />

import {<br />
compose,<br />
withApollo,<br />
gql<br />
} from 'react-apollo';<br />
=> const compose = require('react-apollo').compose;<br />
=> const withApollo = require('react-apollo').withApollo;<br />
=> const gql = require('react-apollo').gql;<br />
