import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);

// Signature cinematic ease used across reveals — a gentle, confident
// deceleration rather than a linear/robotic one.
CustomEase.create("pineaEase", "0.16, 1, 0.3, 1");

// Small, fixed vocabulary of easing curves — used consistently across the
// whole site instead of ad-hoc easing per component, so every animation
// "feels" like it belongs to the same motion language.
CustomEase.create("pineaOut", "0.104, 0.204, 0.492, 1"); // color/opacity/clip-path — soft landing
CustomEase.create("pineaInOut", "0.472, 0.04, 0.526, 1"); // translate/scale — symmetric in-out
CustomEase.create("pineaMorph", "0.642, 0, 0.328, 1"); // round-element morphs (menu button etc.)

export { gsap, ScrollTrigger, SplitText, CustomEase };
