export const settings = { t_ext: -32, t_int: 18, c: 1.005, rho: 1.2, margin: 1.1 };
export let rooms = [];

export function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    
    const e = window.event;
    if (e && e.currentTarget) {
        e.currentTarget.classList.add('active');
    }

    if (tabId === 'systems') updateSystems();
}

export function addRoom() {
    const area = parseFloat(document.getElementById('r_area').value) || 0;
    const height = parseFloat(document.getElementById('r_height').value) || 0;
    const multIn = parseFloat(document.getElementById('r_mult_in').value) || 0;
    const multOut = parseFloat(document.getElementById('r_mult_out').value) || 0;

    const vol = area * height;

    const flowIn = multIn > 10 ? multIn : vol * multIn;
    const flowOut = multOut > 10 ? multOut : vol * multOut;

    const room = {
        id: Date.now(),
        name: document.getElementById('r_name').value || 'Без названия',
        type: document.getElementById('r_type').value || 'Не указан',
        area: area,
        height: height,
        vol: vol,
        sysIn: document.getElementById('r_sys_in').value.trim(),
        sysOut: document.getElementById('r_sys_out').value.trim(),
        flowIn: flowIn,
        flowOut: flowOut
    };

    rooms.push(room);
    renderRooms();

    document.getElementById('r_name').value = '';
    document.getElementById('r_type').value = '';
}

export function deleteRoom(id) {
    rooms = rooms.filter(r => r.id !== id);
    renderRooms();
}

export function renderRooms() {
    const tbody = document.getElementById('roomsBody');
    tbody.innerHTML = '';

    rooms.forEach(r => {
        tbody.innerHTML += `
        <tr>
            <td><strong>${r.name}</strong></td>
            <td><span style="color: #475569;">${r.type}</span></td>
            <td>${r.area.toFixed(1)}</td>
            <td>${r.height.toFixed(1)}</td>
            <td>${r.vol.toFixed(1)}</td>
            <td class="sys-in">${Math.ceil(r.flowIn)}</td>
            <td><strong>${r.sysIn || '-'}</strong></td>
            <td class="sys-out">${Math.ceil(r.flowOut)}</td>
            <td><strong>${r.sysOut || '-'}</strong></td>
            <td><button class="del-btn" onclick="deleteRoom(${r.id})">Удалить</button></td>
        </tr>
        `;
    });
}

export function updateSystems() {
    const sysMap = {};

    rooms.forEach(r => {
        if (r.sysIn && r.flowIn > 0) {
            if (!sysMap[r.sysIn]) sysMap[r.sysIn] = { flow: 0, isSupply: true };
            sysMap[r.sysIn].flow += r.flowIn;
        }
        if (r.sysOut && r.flowOut > 0) {
            if (!sysMap[r.sysOut]) sysMap[r.sysOut] = { flow: 0, isSupply: false };
            sysMap[r.sysOut].flow += r.flowOut;
        }
    });

    const tbody = document.getElementById('systemsBody');
    tbody.innerHTML = '';

    for (let sys in sysMap) {
        const baseFlow = sysMap[sys].flow;
        const marginFlow = baseFlow * settings.margin;

        let heatLoad = 0;
        if (sysMap[sys].isSupply) {
            heatLoad = (marginFlow * settings.c * (settings.t_int - settings.t_ext) * settings.rho) / 3600;
        }

        tbody.innerHTML += `
        <tr>
            <td style="font-weight:bold; color:${sysMap[sys].isSupply ? 'var(--primary)' : 'var(--exit)'}">${sys}</td>
            <td>${Math.ceil(baseFlow)}</td>
            <td style="font-weight:bold;">${Math.ceil(marginFlow)}</td>
            <td><strong>${heatLoad > 0 ? heatLoad.toFixed(2) + ' кВт' : '-'}</strong></td>
        </tr>
        `;
    }
}