.segment "HEADER"
.byte "NES", $1A  
.byte 1           
.byte 1
.byte %00000001
.byte 0
.byte 0, 0, 0, 0, 0, 0, 0, 0

.segment "CODE"

.org $8000 

jsr_test:
    ldx #$ff
    inx
    inx
    inx
    inx
    txs
    jsr lsr_test 
    sec
    sei
    sed

lsr_test:
    lda #$80
    lsr
    lsr
    rts

sbc_test:
    sec
    lda #$08
    sbc #$02


ror_test:
    lda #$80
    ror
    ror
    ror
    ror
    ror

rol_test:
    lda #$80
    rol a
    rol a
    rol a
    rol a

php_test:
    ldx #$ff
    txs
    sec
    php
    clc
    plp

pha_test:
    ldx #$FF
    txs
    lda #$ff
    pha
    lda #$32
    pha
    lda #$22
    pha

pla_test:
    pla
    pla
    pla


adc_test:
    sec
    lda #$ff
    ldx #$ff
    stx $04
    adc $04

tya_test:
    ldy #$03
    tya
    
txs_test:
    ldx #$ff
    txs

txa_test:
    ldx #$04
    txa

tay_test:
    lda #$08
    tay


tax_test:
    lda #$08
    tax

sty_test:
    ldy #$07
    sty $04
    inc $04
    lda $04

stx_test:
    ldx #$07
    stx $04
    inc $04
    inc $04
    inc $04
    inc $04
    inc $04
    inc $04
    lda $04


sta_test:
    lda #$07
    sta $04
    inc $04
    inc $04
    inc $04
    inc $04
    inc $04
    ldx $04

sed_test:
    sed

sec_test:
    sec

ora_test:
    lda #$0f
    ora #$f0

jmp_test:
    sei
    sei
    jmp $8000

iny_test:
    ldy #$fe
    iny
    iny
    iny
    iny


inx_test:
    ldx #$07
    inx
    inx
    inx
    inx

eor_test:
    lda #$10
    eor #$10

cpy_test:
    ldy #$10
    cpy #$10

cpx_test:
    ldx #$10
    cpx #$10

cli_test:
    sei
    cli

sei_test:
    sei

clc_test:
    lda #$10
    cmp #$10
    clc

bpl_test:
    lda #$0F
    bpl beq_test

bne_test:
    lda #$10
    cmp #$16
    bne asl_test

bmi_test:
    lda #$FF
    bmi beq_test

bit_test:
    lda #$ff
    ldx #$ff
    stx $01
    bit $01

beq_test:
    lda #$10
    cmp #$16
    beq asl_test

bcs_test:
    lda #$10
    cmp #$10
    bcs asl_test

cmp_test:
    lda #$10
    cmp #$10
    ldx #$00
    lda #$20
    sta $02
    cmp $02
    lda #$30
    sta $1000
    lda #$20
    cmp $1000


bcc_test:
    bcc and_test

asl_test:
    lda #$40
    asl a

and_test:
    lda #$ff
    and #$80

lda_test:
    ldx #$02
    lda $8000,x

dec_test:
    lda #$07
    sta $04
    dec $04
    dec $04
    lda $04

inc_test:
    lda #$07
    sta $04
    inc $04
    inc $04
    inc $04
    ldx $04

dey_test:
    ldy #$02
    dey
    dey
    dey
    dey

dex_test:
    ldx #$01
    dex
    dex
    dex

nmi_handler:
    RTI

irq_handler:
    RTI

.segment "VECTORS"
.word nmi_handler
.word  $8000
.word irq_handler
