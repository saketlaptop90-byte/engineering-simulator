import * as THREE from 'three';

// Fallback materials for dynamically imported machine components
export const plastic = new THREE.MeshStandardMaterial({ color: 0xcccccc });
export const aluminum = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8, roughness: 0.2 });
export const glass = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 });
export const copper = new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.9, roughness: 0.2 });
export const steel = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.7, roughness: 0.3 });
export const darkSteel = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.7, roughness: 0.4 });
export const gold = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 1.0, roughness: 0.15 });
export const brass = new THREE.MeshStandardMaterial({ color: 0xb5a642, metalness: 0.9, roughness: 0.25 });
export const silver = new THREE.MeshStandardMaterial({ color: 0xc0c0c0, metalness: 1.0, roughness: 0.1 });
export const titanium = new THREE.MeshStandardMaterial({ color: 0x878681, metalness: 0.8, roughness: 0.3 });
export const ceramic = new THREE.MeshStandardMaterial({ color: 0xf5f5dc, metalness: 0.0, roughness: 0.6 });
export const carbonFiber = new THREE.MeshStandardMaterial({ color: 0x1a1a2e, metalness: 0.3, roughness: 0.4 });
export const rubber = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 });
export const chrome = new THREE.MeshStandardMaterial({ color: 0xeeeeee, metalness: 1.0, roughness: 0.05 });
export const tinted = new THREE.MeshStandardMaterial({ color: 0x333333, transparent: true, opacity: 0.6 });

export const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x999999 });
export const rollerMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
export const bladeMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.8 });
export const ghostMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.2, wireframe: true });
export const damagedOverlay = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.5 });
