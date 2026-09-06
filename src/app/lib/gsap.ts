import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);

// Signature cinematic ease used across reveals — a gentle, confident
// deceleration rather than a linear/robotic one.
CustomEase.create("pineaEase", "0.16, 1, 0.3, 1");

export { gsap, ScrollTrigger, SplitText, CustomEase };
