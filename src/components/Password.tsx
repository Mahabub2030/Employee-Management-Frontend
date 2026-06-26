import { Component } from "@angular/core";

import { Eye, EyeOff, LucideAngularModule } from "lucide-angular";

@Component({
  selector: "input",
  imports: [LucideAngularModule],
  template: `
    <div class="space-y-2">
      <label oriLabel htmlFor="input-23">Show/hide password input</label>
      <div class="relative">
        <input
          class="pe-9"
          id="input-23"
          [type]="isVisible ? 'text' : 'password'"
          input
          placeholder="Password"
        />
        <button
          class="text-muted-foreground/80 hover:text-foreground focus-visible:outline-ring/70 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg outline-offset-2 transition-colors focus:z-10 focus-visible:outline focus-visible:outline-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          [attr.aria-pressed]="isVisible"
          [attr.aria-label]="isVisible ? 'Hide password' : 'Show password'"
          (click)="toggleVisibility()"
          type="button"
          aria-controls="password"
        >
          <lucide-angular
            [img]="isVisible ? EyeOffIcon : EyeIcon"
            size="16"
            strokeWidth="2"
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  `,
})
export default class Password {
  readonly EyeIcon = Eye;
  readonly EyeOffIcon = EyeOff;

  isVisible = false;

  toggleVisibility() {
    this.isVisible = !this.isVisible;
  }
}
