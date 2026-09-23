import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

export type LightType = 'g1' | 'g2' | 'g3' | 'g4' | 'g5' | 'g6' | 'g7' | 'g8' | 'g9';

export interface Light {
  id: number;
  types: LightType[];
  x: number;
  y: number;
  isOn: boolean;
  isBroken?: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private http = inject(HttpClient);
  esp32Ip = signal('192.168.100.105');

  updateIp(event: Event) {
    const input = event.target as HTMLInputElement;
    this.esp32Ip.set(input.value.trim());
  }

  lights = signal<Light[]>([
    { id: 1, types: ['g1'], x: 175, y: 225, isOn: false },
    { id: 2, types: ['g1'], x: 225, y: 225, isOn: false },
    { id: 3, types: ['g1'], x: 200, y: 250, isOn: false },
    { id: 4, types: ['g1'], x: 175, y: 275, isOn: false },
    { id: 5, types: ['g1'], x: 225, y: 275, isOn: false },

    { id: 6, types: ['g2'], x: 150, y: 200, isOn: false },
    { id: 7, types: ['g2'], x: 250, y: 200, isOn: false },
    { id: 8, types: ['g2'], x: 150, y: 300, isOn: false },
    { id: 9, types: ['g2'], x: 250, y: 300, isOn: false },

    { id: 10, types: ['g3'], x: 125, y: 175, isOn: false },
    { id: 11, types: ['g3'], x: 275, y: 175, isOn: false },
    { id: 12, types: ['g3'], x: 125, y: 325, isOn: false },
    { id: 13, types: ['g3'], x: 275, y: 325, isOn: false },

    { id: 14, types: ['g4'], x: 200, y: 100, isOn: false },
    { id: 15, types: ['g4'], x: 350, y: 250, isOn: false },
    { id: 16, types: ['g4'], x: 200, y: 400, isOn: false },
    { id: 17, types: ['g4'], x: 50, y: 250, isOn: false },

    { id: 18, types: ['g5'], x: 50, y: 100, isOn: false },
    { id: 19, types: ['g5'], x: 350, y: 100, isOn: false },
    { id: 20, types: ['g5'], x: 50, y: 400, isOn: false },
    { id: 21, types: ['g5'], x: 350, y: 400, isOn: false },

    { id: 22, types: ['g6'], x: 125, y: 50, isOn: false },
    { id: 23, types: ['g6'], x: 275, y: 50, isOn: false },
    { id: 24, types: ['g6'], x: 125, y: 450, isOn: false },
    { id: 25, types: ['g6'], x: 275, y: 450, isOn: false },

    { id: 26, types: ['g7'], x: 50, y: 20, isOn: false },
    { id: 27, types: ['g7'], x: 200, y: 20, isOn: false },
    { id: 28, types: ['g7'], x: 350, y: 20, isOn: false },

    { id: 29, types: ['g8'], x: 125, y: -40, isOn: false },
    { id: 30, types: ['g8'], x: 200, y: -60, isOn: false },
    { id: 31, types: ['g8'], x: 275, y: -40, isOn: false },

    { id: 32, types: ['g9'], x: 50, y: 500, isOn: false },
    { id: 33, types: ['g9'], x: 125, y: 500, isOn: false },
    { id: 34, types: ['g9'], x: 200, y: 500, isOn: false },
    { id: 35, types: ['g9'], x: 275, y: 500, isOn: false },
    { id: 36, types: ['g9'], x: 350, y: 500, isOn: false },
  ]);

  groups = [
    { id: 'g1', name: 'Centro (D25)', color: '#ef4444', count: 5 },
    { id: 'g2', name: 'Producción 1 (D18)', color: '#3b82f6', count: 4 },
    { id: 'g3', name: 'Ayudas 1 (D26)', color: '#3b82f6', count: 4 },
    { id: 'g4', name: 'Ayudas 2 (D33)', color: '#22c55e', count: 4 },
    { id: 'g5', name: 'Hastiales 1 (D32)', color: '#f59e0b', count: 4 },
    { id: 'g6', name: 'Hastiales 2 (D19)', color: '#ffffff', count: 4 },
    { id: 'g7', name: 'Corona 1 (D27)', color: '#ef4444', count: 3 },
    { id: 'g8', name: 'Corona 2 (D14)', color: '#a855f7', count: 3 },
    { id: 'g9', name: 'Arrastre (D21)', color: '#f97316', count: 5 },
  ];

  getRelayForGroup(groupId: string): number {
    const map: Record<string, number> = {
      g1: 27, // Se cambió con g7
      g2: 18,
      g3: 26,
      g4: 21, // Se cambió con g9
      g5: 32,
      g6: 19,
      g7: 25, // Se cambió con g1
      g8: 14,
      g9: 33, // Se cambió con g4
    };
    return map[groupId] || 25;
  }

  toggleLight(id: number) {
    if (id === 3) return;
    const light = this.lights().find((l) => l.id === id);
    if (light) {
      if (light.types.length > 0) {
        this.toggleGroup(light.types[0]);
      }
    }
  }

  toggleGroup(id: string) {
    this.lights.update((ls) => {
      const groupLights = ls.filter((l) => l.types.includes(id as LightType));
      if (groupLights.length === 0) return ls;

      const allOn = groupLights.every((l) => l.isOn);
      const newState = !allOn;

      const relayNum = this.getRelayForGroup(id);
      this.sendToEsp32Relay(relayNum, newState);

      return ls.map((l) => (l.types.includes(id as LightType) ? { ...l, isOn: newState } : l));
    });
  }

  isGroupOn(id: string): boolean {
    const ls = this.lights();
    const groupLights = ls.filter((l) => l.types.includes(id as LightType));
    if (groupLights.length === 0) return false;
    return groupLights.every((l) => l.isOn);
  }

  async turnAll(state: boolean) {
    this.lights.update((ls) => ls.map((l) => ({ ...l, isOn: state })));

    if (state) {
      const pins = [25, 26, 27, 14, 18, 19, 32, 33, 21];
      for (const pin of pins) {
        this.sendToEsp32Relay(pin, true, true);
        await new Promise((r) => setTimeout(r, 150));
      }
    } else {
      const url = `http://${this.esp32Ip().trim()}/relays/off`;
      this.http.get(url).subscribe({
        error: (err) => console.error('Error al apagar todos', err),
      });
    }
  }

  async turnAllOn() {
    await this.turnAll(true);
  }
  async turnAllOff() {
    await this.turnAll(false);
  }

  private async sendToRelays(relays: number[], state: boolean) {
    for (const relay of relays) {
      this.sendToEsp32Relay(relay, state, true);
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  private sendToEsp32Relay(relayNum: number, state: boolean, skipStatusCheck: boolean = false) {
    if (relayNum <= 0) return;

    const action = state ? 'on' : 'off';
    const url = `http://${this.esp32Ip().trim()}/relay${relayNum}/${action}`;

    this.http.get(url).subscribe({
      next: (res) => {
        console.log(`Comando enviado al ESP32: ${url}`, res);
        if (!skipStatusCheck) {
          setTimeout(() => this.checkAllStatus(), 400);
        }
      },
      error: (err) => console.error('Error al enviar comando al ESP32', err),
    });
  }

  private checkAllStatus() {
    const url = `http://${this.esp32Ip().trim()}/relays/status`;
    this.http.get<any>(url).subscribe({
      next: (res) => {
        console.log('Status global del ESP32:', res);
        if (res.success) {
          this.lights.update((ls) => ls.map((l) => ({ ...l, isBroken: false })));
        }
      },
      error: (err) => console.error('Error al verificar status', err),
    });
  }

  isSequentialRunning = signal(false);
  currentSequentialStep = signal(0);

  async sequentialOn() {
    if (this.isSequentialRunning()) return;

    this.isSequentialRunning.set(true);
    this.currentSequentialStep.set(0);

    await this.turnAllOff();

    await new Promise((resolve) => setTimeout(resolve, 800));

    for (let i = 0; i < this.groups.length; i++) {
      if (!this.isSequentialRunning()) break;

      this.currentSequentialStep.set(i + 1);

      if (i > 0) {
        const prevGroup = this.groups[i - 1];
        this.lights.update((ls) => {
          const prevRelay = this.getRelayForGroup(prevGroup.id);
          this.sendToEsp32Relay(prevRelay, false, true);
          return ls.map((l) =>
            l.types.includes(prevGroup.id as LightType) ? { ...l, isOn: false } : l,
          );
        });
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      const currentGroup = this.groups[i];
      this.lights.update((ls) => {
        const relayNum = this.getRelayForGroup(currentGroup.id);
        this.sendToEsp32Relay(relayNum, true, true);

        return ls.map((l) =>
          l.types.includes(currentGroup.id as LightType) ? { ...l, isOn: true } : l,
        );
      });

      await new Promise((resolve) => setTimeout(resolve, this.sequentialDelayMs()));
    }

    if (this.isSequentialRunning()) {
      const lastGroup = this.groups[this.groups.length - 1];
      this.lights.update((ls) => {
        const lastRelay = this.getRelayForGroup(lastGroup.id);
        this.sendToEsp32Relay(lastRelay, false, true);
        return ls.map((l) =>
          l.types.includes(lastGroup.id as LightType) ? { ...l, isOn: false } : l,
        );
      });

      setTimeout(() => {
        this.isSequentialRunning.set(false);
        this.currentSequentialStep.set(0);
      }, 1000);
    }
  }

  stopSequential() {
    this.isSequentialRunning.set(false);
    this.currentSequentialStep.set(0);
    this.turnAllOff();
  }

  sequentialDelayMs = signal(1500);

  updateSequentialDelay(event: Event) {
    const input = event.target as HTMLInputElement;
    const val = parseInt(input.value, 10);
    if (!isNaN(val) && val >= 500 && val <= 10000) {
      this.sequentialDelayMs.set(val);
    }
  }
}
