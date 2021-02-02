<template>
  <div :class="theme">
    <div class="highlight">
      <div class="highlight__inner" :style="color ? 'background-color: ' + color : ''">
        <div class="gauge" :class="'percent-'+percent + ' ' + 'former-'+former">
          <div class="dial">
            <div class="bar">
              <div class="circle circle-bg" :style="shadow ? 'color: ' + shadow : ''"></div>
              <div class="circle circle-cover"></div>
            </div>
            <div class="needle" v-if="!loading">
              <div class="inner">
              </div>
            </div>
          </div>
          <div role="status" class="text">
            <span>code</span>
            <span v-text="loading ? unknown : code"></span>
          </div>
        </div>
        <div>
          <h2 v-text="heading"></h2>
          <p v-if="clarification"><strong v-text="clarification"></strong></p>
          <div v-html="legend"></div>
          <p class="small">{{ nextUpdateIn }} {{ timeRemaining }} {{ timeRemaining !== 1 ? minutes : minute }}.</p>
        </div>
      </div>
    </div>
  </div>
</template>


<script>

export default {
  name: 'Druktemeter.vue',
  props: {
    /**
     * Reset needle before each fetch?
     * true or false (default)
     */
    reset: Boolean,
    /**
     * Background color.
     * #aabb00
     */
    color: String,
    /**
     * Shadow color.
     * #aabb22
     */
    shadow: String,
    /**
     * Fixed value.
     * 0 - 100
     */
    value: Number,
    heading: {
      type: String,
      default: () => 'Volg live hoe druk het is in centrum Gent',
    },
    /**
     * Legend.
     * Limited HTML possible.
     */
    legend: {
      type: String,
      default: () =>
          '<p><strong>Groen: </strong>het is momenteel rustig in het centrum.<br>' +
          '<strong>Oranje: </strong>er is veel volk in het centrum, je plant je bezoek beter op een ander moment.<br>' +
          '<strong>Rood:</strong> kom niet naar het centrum, het is te druk.</p>'
    },
    green: {
      type: String,
      default: () => 'groen',
    },
    red: {
      type: String,
      default: () => 'rood',
    },
    orange: {
      type: String,
      default: () => 'oranje',
    },
    unknown: {
      type: String,
      default: () => 'ongekend',
    },
    nextUpdateIn: {
      type: String,
      default: () => 'Volgende update binnen',
    },
    minutes: {
      type: String,
      default: () => 'minuten',
    },
    minute: {
      type: String,
      default: () => 'minuut',
    },
    /**
     * Dataset ID + querystring.
     */
    dataset: {
      type: String,
      default: () => 'druktebarometer-info&q=&sort=tijd_van_voltooien&rows=1'
    },
    /**
     * Milliseconds between requests.
     */
    timeout: {
      type: Number,
      default: 590000
    },
    /**
     * Ghent Styleguide color scheme indicator.
     */
    theme: {
      type: String,
      default: 'cs--cyan'
    }
  },
  data () {
    return {
      loading: true,
      percent: 1,
      former: 1,
      clarification: null,
      remaining: null
    };
  },
  computed: {
    timeRemaining () {
      const min = Math.floor((this.remaining / 1000) / 60);
      return Math.round(min) + 1;
    },
    code () {
      if (this.percent <= Math.round((1 / 3) * 100)) {
        return this.green;
      }
      if (this.percent <= Math.round((2 / 3) * 100)) {
        return this.orange;
      }
      return this.red;
    }
  },
  methods: {
    fetchAndUpdate () {
      return this.fetch()
          .then(this.update)
          .then(() => this.loading = false)
          .catch(() => this.loading = true);
    },
    fetch () {
      if (!this.dataset) {
        return;
      }

      if (this.dataset === 'develop') {
        return new Promise(resolve =>
            resolve({
              status_druktemeter: Math.floor(Math.random() * 100)
            }));
      }

      if (this.value || this.value === 0) {
        return new Promise(resolve =>
            resolve({
              status_druktemeter: this.value
            }));
      }

      let url = `https://data.stad.gent/api/records/1.0/search/?dataset=${this.dataset}`;
      return fetch(url)
          .then(response => response.json())
          .then(({records}) => records[0])
          .then(({fields}) => fields);
    },
    update ({status_druktemeter, toelichting_drukte}) {

      const setValue = () => {
        this.clarification = toelichting_drukte;
        this.former = this.percent;

        if (status_druktemeter > 100) {
          this.percent = 100;
          return;
        }
        if (status_druktemeter < 0) {
          this.percent = 0;
          return;
        }

        this.percent = status_druktemeter;
      };

      if (this.reset) {
        this.former = 0;
        this.percent = 0;
        setTimeout(setValue, 400);
        return;
      }

      setTimeout(setValue, 400);
    }
  },
  mounted () {
    this.fetchAndUpdate();
    this.remaining = this.timeout;

    setInterval(() => {
      this.remaining = this.timeout;
      this.fetchAndUpdate();
    }, this.timeout);

    setInterval(() => this.remaining -= 1000, 1000);
  }
};
</script>

<style lang="scss">

$styleguide-dir: '../../node_modules/gent_styleguide/build/styleguide';
$font-dir: 'https://bartdelrue.github.io';

@import 'settings.scss';
@import 'mixins.scss';
@import 'base.scss';
@import "atoms.scss";
@import "molecules.scss";

$needle-height: 5.6rem;
$needle-top-height: 5.3rem;
$needle-width: 0.6rem;
$needle-speed: 2s;
$needle-easing: ease-out;
$circle-radius: 4.75rem;
$circle-diameter: $circle-radius * 2;
$circle-color-bg: #80CEF0;
$circle-color-cover: #fff;
$dial-stroke-width: 1.5rem;
$start-pos: -120deg;
$dial-stroke-length: 80deg;

.highlight {

  padding-top: $circle-radius + 1rem;
  text-align: left;

  .small {
    font-size: .8em;
  }

  .highlight__inner {
    padding-top: 2rem + $circle-radius;
    min-height: $circle-diameter + 5rem;
  }

  .gauge {
    display: block;
    min-width: $circle-diameter + 1rem;
    height: $circle-diameter + 1rem;
    padding-top: .5rem;
    position: absolute;
    margin: auto;
    border-radius: 50%;
    z-index: 1;
    top: 0;
    right: 0;
    bottom: auto;
    left: 0;
  }

  @media (min-width: 768px) {

    padding-top: 0;

    .highlight__inner {
      padding-top: 2rem;
      padding-left: 4rem + $circle-diameter;
    }

    .gauge {
      top: calc(50% - 5.5rem);
      right: auto;
      bottom: auto;
      left: 1rem;
    }
  }

  @mixin animation {
    transform-origin: bottom center;
    animation-duration: $needle-speed;
    animation-iteration-count: 1;
    animation-timing-function: $needle-easing;
    animation-fill-mode: forwards;
  }

  .gauge {
    @for $i from 0 through 100 {
      &.former-#{$i} .needle {
        transform: rotate(-(90deg - $start-pos) - (($i/100) * 2 * $start-pos));
      }
      &.percent-#{$i} .needle {
        animation-name: to-#{$i};
        @include animation;
      }
    }

    .text {
      position: absolute;
      z-index: 30;
      top: 65%;
      left: 25%;
      text-align: center;
      width: 50%;

      span {
        display: block;
        line-height: 1.5;
        text-shadow: 2px 0 0 #fff, -2px 0 0 #fff, 0 2px 0 #fff, 0 -2px 0 #fff, 1px 1px #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff;

        &:last-of-type {
          text-transform: uppercase;
          font-weight: bold;
        }
      }
    }

    .needle {
      position: absolute;
      left: 0;
      right: 0;
      top: -.3rem;
      width: $needle-width;
      margin: 0 auto;
      z-index: 50;

      .inner {
        height: $needle-height;
        width: $needle-width;
        position: relative;
        transform: rotate(90deg);
        transform-origin: bottom center;
        background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMSBUaW55Ly9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLXRpbnkuZHRkIj48c3ZnIHZlcnNpb249IjEuMSIgYmFzZVByb2ZpbGU9InRpbnkiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjEycHgiIGhlaWdodD0iMTEzcHgiIHZpZXdCb3g9IjAgMCAxMiAxMTMiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxwYXRoIGZpbGw9IiM2NzY3NjciIGQ9Ik0wLjA2NywxMDYuMzQ0Yy0wLjAxNiwwLjEzNS0wLjAyNCwwLjU0My0wLjAzMiwwLjY4MWwtMC4wMTIsMC40MTFoMC4wMDVjLTAuMDAxLDAtMC4wMTEtMC4xNDYtMC4wMTEtMC4wODFjMC4wMDYsMy4xOSwyLjY4OSw1LjYzNSw1Ljk5NSw1LjYyOWMzLjMwNC0wLjAwNyw1Ljk3OC0yLjY2Niw1Ljk3MS01Ljg1NmMtMC4wMDEtMC40MTUtMC4wNS0wLjg1My0wLjEzNi0xLjI0Mkw2LjAxMiwwLjEyNEwwLjA2NywxMDYuMzQ0eiIvPjwvc3ZnPg==);
        background-size: 100%;
      }
    }

    .bar {
      position: relative;
      height: $circle-radius;
    }

    .circle {
      height: $circle-diameter;
      width: $circle-diameter;
      border-radius: $circle-diameter;

      margin: 0 auto;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      transform-origin: bottom center;
    }

    .circle-bg {
      @include theme('color', 'color-primary', 'highlight-spot-shadow');

      background-color: $circle-color-bg;
      background: conic-gradient(from $start-pos,
          #38ab30 0 $dial-stroke-length,
          #fab600 $dial-stroke-length $dial-stroke-length*2,
          #f20f36 $dial-stroke-length*2 $dial-stroke-length*3,
          $circle-color-cover $dial-stroke-length*3 0);
      z-index: 10;
      box-shadow: 0 10px 35px -25px;
    }

    .circle-cover {
      height: $circle-diameter - $dial-stroke-width * 2;
      width: $circle-diameter - $dial-stroke-width * 2;
      border-radius: $circle-diameter;
      background: $circle-color-cover;
      margin: 0 auto;
      top: $dial-stroke-width;
      bottom: 0;
      z-index: 30;
    }
  }

  // Generate keyframes
  @for $i from 0 through 100 {
    @keyframes to-#{$i} {
      100% {
        transform: rotate(-(90deg - $start-pos) - (($i/100) * 2 * $start-pos));
      }
    }
  }
}

</style>
