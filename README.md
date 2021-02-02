# Druktemeter

A vue based web component.

* Uses the [city of Ghent Style guide](https://www.npmjs.com/package/gent_styleguide)
* Uses
  the [city of Ghent Open Data](https://data.stad.gent/explore/?disjunctive.keyword&disjunctive.theme&sort=modified)
* WCAG 2.1 AA compliant. If you do encounter problems, we urge you to create an issue.

## Properties

| Property     | Type    | Optional | Default                                                                                                                                                                                                                                               | Description                                              |
| ------------ | ------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| reset        | Boolean | yes      | false                                                                                                                                                                                                                                                 | Should the gauge return to zero between each data fetch? |
| color        | String  | yes      | undefined                                                                                                                                                                                                                                             | Background color.                                        |
| shadow       | String  | yes      | undefined                                                                                                                                                                                                                                             | Shadow color.                                            |
| value        | Number  | yes      | undefined                                                                                                                                                                                                                                             | Set a fixed value.                                       |
| heading      | String  | yes      | Volg live hoe druk het is in centrum Gent                                                                                                                                                                                                             |                                                          |
| legend       | String  | yes      | <p><strong>Groen: </strong>het is momenteel rustig in het centrum.<br><strong>Oranje: </strong>er is veel volk in het centrum, je plant je bezoek beter op een ander moment.<br><strong>Rood:</strong> kom niet naar het centrum, het is te druk.</p> |                                                          |
| green        | String  | yes      | groen                                                                                                                                                                                                                                                 |                                                          |
| red          | String  | yes      | rood                                                                                                                                                                                                                                                  |                                                          |
| orange       | String  | yes      | oranje                                                                                                                                                                                                                                                |                                                          |
| unknown      | String  | yes      | ongekend                                                                                                                                                                                                                                              |                                                          |
| nextUpdateIn | String  | yes      | Volgende update binnen                                                                                                                                                                                                                                |                                                          |
| minutes      | String  | yes      | minuten                                                                                                                                                                                                                                               |                                                          |
| minute       | String  | yes      | minuut                                                                                                                                                                                                                                                |                                                          |
| dataset      | String  | yes      | druktebarometer-info&q=&sort=tijd_van_voltooien&rows=1                                                                                                                                                                                                | Dataset ID + querystring.                                |
| timeout      | String  | yes      | 590000                                                                                                                                                                                                                                                | Milliseconds between requests.                           |
| theme        | String  | yes      | cs--cyan                                                                                                                                                                                                                                              | Ghent Styleguide color scheme indicator.                 |

## Project setup

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn serve
```

### Build a single vue component as web component

```
yarn build
```

Take a look at the [demo page](./demo).

### Lints and fixes files

```
yarn lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
