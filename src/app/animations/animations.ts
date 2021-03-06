import {animate, animation, AnimationReferenceMetadata, keyframes, query, state, style, transition} from '@angular/animations';

export function bounceInY(a, b, c, d, timing): AnimationReferenceMetadata {
  return animation(
    animate(
      '1s',
      keyframes([
        style({
          opacity: 0,
          transform: 'translate3d(0, {{ a }}, 0)',
          offset: 0
        }),
        style({
          opacity: 1,
          transform: 'translate3d(0, {{ b }}, 0)',
          offset: 0.6
        }),
        style({transform: 'translate3d(0, {{ c }}, 0)', offset: 0.75}),
        style({transform: 'translate3d(0, {{ d }}, 0)', offset: 0.9}),
      ])
    ),
    {
      params: {
        timing,
        delay: 0,
        a,
        b,
        c,
        d
      }
    }
  );
}

export const flyInForCards = (
  [
    state('loading', style({
      transform: 'translate3d(-3000px, 0, 0)'
    })),
    transition('loading => finished',
      animate('0.5s cubic-bezier(.52,1.06,.71,1)',
        style({
          transform: 'translate3d(0, 0px, 0)'
        })))
  ]);
export const flyOutForRouter = ([
  transition('* <=> *',  [
    query(':leave', // [
      // query('.main-router-flyout',
      [ animate('0.5s cubic-bezier(.52,1.06,.71,1)',
        style({
          transform: 'translate3d(-3000px, 0, 0)',
          zIndex: 1000
        })
      )],
      {optional: true}
    )
  ])
]);

