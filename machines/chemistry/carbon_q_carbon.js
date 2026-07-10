export const chem_c_q_carbon = {
    id: 'chem_c_q_carbon',
    name: 'Carbon - Q-Carbon',
    type: 'chemistry',
    category: 'Chemistry',
    price: 150000,
    description: 'Q-Carbon. A distinct, metastable phase of solid carbon created by rapidly quenching carbon plasma. It is ferromagnetic, glows upon exposure to energy, and is harder than diamond.',
    particles: '350 carbon atoms in an amorphous-like but highly bonded ultra-dense state',
    connections: '75% sp3 and 25% sp2 hybridized ultra-tight bonds',
    isPremium: true,
    
    init: function(engine) {
        this.engine = engine;
        this.particles = [];
        this.constraints = [];
        this.createStructure();
    },

    createStructure: function() {
        const count = parseInt(this.particles.match(/\d+/)[0]) || 200;
        const cx = 400, cy = 300;
        
        for (let i = 0; i < count; i++) {
            const phi = Math.acos(1 - 2 * (i + 0.5) / count);
            const theta = Math.PI * (1 + Math.sqrt(5)) * i;
            
            let r = 80;
            if (this.id === 'chem_c_foam') {
                // Sponge-like porous distribution
                r = 90 * (1 + 0.5 * Math.sin(theta * 4) * Math.cos(phi * 4));
            } else if (this.id === 'chem_c_q_carbon') {
                // Dense inner core
                r = 50 + (i % 30);
            } else if (this.id === 'chem_c_penta_graphene') {
                // Flat 2D disk
                r = 100 * Math.sqrt((i + 0.5) / count);
            } else {
                r = 80 * (1 + 0.1 * Math.sin(theta * 3));
            }
            
            let x = 0, y = 0;
            if (this.id === 'chem_c_penta_graphene') {
                x = r * Math.cos(theta * 8) + cx;
                y = r * Math.sin(theta * 8) + cy;
            } else {
                x = r * Math.sin(phi) * Math.cos(theta) + cx;
                y = r * Math.sin(phi) * Math.sin(theta) + cy;
            }
            
            const particle = this.engine.addParticle(x, y, {
                mass: 12.011,
                radius: 6,
                restitution: 0.9,
                friction: 0.05,
                color: this.id === 'chem_c_q_carbon' ? '#4444aa' : '#3b3b3b',
                label: 'C',
                element: 'Carbon'
            });
            
            particle.vx = (Math.random() - 0.5) * 0.4;
            particle.vy = (Math.random() - 0.5) * 0.4;
            
            this.particles.push(particle);
        }
        
        const connectThreshold = this.id === 'chem_c_q_carbon' ? 35 : 45;
        
        for (let i = 0; i < this.particles.length; i++) {
            let connections = 0;
            for (let j = i + 1; j < this.particles.length; j++) {
                const p1 = this.particles[i];
                const p2 = this.particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                
                if (dist < connectThreshold && connections < 4) {
                    const bond = this.engine.addConstraint(p1, p2, {
                        stiffness: 0.85,
                        damping: 0.05,
                        length: dist,
                        color: this.id === 'chem_c_q_carbon' ? 'rgba(100, 100, 255, 0.4)' : 'rgba(0, 255, 255, 0.3)',
                        width: 1.5
                    });
                    this.constraints.push(bond);
                    connections++;
                }
            }
        }
    },
    
    update: function(dt) {
        const time = Date.now() * 0.001;
        const cx = 400, cy = 300;
        
        this.particles.forEach((p, i) => {
            const dx = p.x - cx;
            const dy = p.y - cy;
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            if (dist > 30) {
                p.vx -= (dx / dist) * 0.05 * (1 + 0.1 * Math.sin(time * 2 + i));
                p.vy -= (dy / dist) * 0.05 * (1 + 0.1 * Math.cos(time * 2 + i));
            }
            
            p.vx += Math.sin(time * 3 + i * 0.3) * 0.15;
            p.vy += Math.cos(time * 3 + i * 0.3) * 0.15;
            
            // Q-carbon exhibits strong magnetic/glow properties, add chaotic twist
            if (this.id === 'chem_c_q_carbon') {
                p.vx += (Math.random() - 0.5) * 0.2;
                p.vy += (Math.random() - 0.5) * 0.2;
            }
        });
    },

    draw: function(ctx) {
        ctx.beginPath();
        this.constraints.forEach(c => {
            ctx.moveTo(c.p1.x, c.p1.y);
            ctx.lineTo(c.p2.x, c.p2.y);
        });
        ctx.strokeStyle = this.id === 'chem_c_q_carbon' ? 'rgba(100, 100, 255, 0.2)' : 'rgba(0, 255, 255, 0.2)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        this.particles.forEach(p => {
            const isQ = this.id === 'chem_c_q_carbon';
            const baseColor = isQ ? '#8888ff' : '#00ffff';
            
            const gradient = ctx.createRadialGradient(p.x - p.radius*0.2, p.y - p.radius*0.2, 0, p.x, p.y, p.radius * 2);
            gradient.addColorStop(0, isQ ? '#aaaaff' : '#ffffff');
            gradient.addColorStop(0.3, isQ ? '#3333aa' : '#444444');
            gradient.addColorStop(1, '#000000');
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2);
            ctx.fillStyle = isQ ? 'rgba(100, 100, 255, 0.08)' : 'rgba(0, 255, 255, 0.05)';
            ctx.fill();
            
            ctx.fillStyle = baseColor;
            ctx.font = '7px Space Grotesk, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(p.label, p.x, p.y);
        });
    }
};
