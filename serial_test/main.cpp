#include "ui.h"
#include "serialib.h"
#include "serial.h"

#include <chrono>
#include <thread>

serialib serial;

int main() {
    serial.openDevice("COM2", 115200);
    ui_self_id = 1;
    ui_init_g();

    for (int i = 0; i < 100; i++) {
        std::this_thread::sleep_for(std::chrono::milliseconds(50));
        ui_g_Ungroup_NewRect8->end_x -= 2;
        ui_g_Ungroup_NewRect8_dirty = 1;
        ui_update_g();
    }

    ui_delete_layer(2, 0);

    serial.closeDevice();
    return 0;
}

void write(uint8_t* msg, int len) {
    serial.writeBytes(msg, len);
}
