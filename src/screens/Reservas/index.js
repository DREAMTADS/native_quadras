import DateTimePicker  from '@react-native-community/datetimepicker';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, FlatList, TouchableOpacity } from 'react-native';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';
import { Button, Checkbox, TextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import quadrasApi from '../../services/quadrasApi.js';

export default function Reservas() {
    const [quadras, setQuadras] = useState([]); 
    const [reservas, setReservas] = useState([]);
    const [selectedQuadra, setSelectedQuadra] = useState('');
    const [pago, setPago] = useState(false);
    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [response, setResponse] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [day, setDay] = useState(new Date());
    const [showList, setShowList] = useState(false);
    const [displayDayPicker, setDisplayDayPicker] = useState(false);
    const [horarios, setHorarios] = useState();

    const listarReservasPorQuadra = async(id) => {
        try{  
            const res = await quadrasApi.get(`/reservas/horarios/${id}`);

            let aux = [];
            let aux2 = [];
            let horarioDoDia = [];
            
            horarioDoDia = handleCreateHorario();

            if(res.status === 200){
                res.data.map(item => {            
                    aux = new Date(item.horarios.inicio).toLocaleTimeString().split(':');
                    if(aux[0] <= 9)
                        aux2.push(`0${aux[0]}:${aux[1]}`)
                    else 
                        aux2.push(`${aux[0]}:${aux[1]}`)
                        

                    aux = new Date(item.horarios.fim).toLocaleTimeString().split(':');
 
                    if(aux[0] <= 9)
                        aux2.push(`0${aux[0]}:${aux[1]}`)
                    else
                        aux2.push(`${aux[0]}:${aux[1]}`)
                });

                aux2.map(hora => horarioDoDia.find((item, index) => {
                    if(item.time === hora) { 
                        horarioDoDia[index].disabled = true;
                    }
                }));
            }

            setHorarios(horarioDoDia);

        } catch {(err) => {console.log(err)}}
    }

    const toDate = (dStr,format) => {
        var now = new Date();
        if (format == "h:m") {
             now.setHours(dStr.substr(0,dStr.indexOf(":")));
             now.setMinutes(dStr.substr(dStr.indexOf(":")+1));
             now.setSeconds(0);
             return now;
        } else 
            return "Invalid Format";
    }

    const handleSelectQuadra = async (id) => {
        setHorarios();
        await listarReservasPorQuadra(id);
        setSelectedQuadra(id);
    }

    const handleCreateHorario = () => {
        setHorarios([]);
        let x = 0;
        let aux = [];
        while(x <= 23){
            if(x <= 9) {
                aux.push({time: `0${x}:00`, disabled: false});
                aux.push({time: `0${x}:30`, disabled: false});
            }
            else { 
                aux.push({time: `${x}:00`, disabled: false});
                aux.push({time: `${x}:30`, disabled: false});
            }
            x++;
        }

        return(aux);
    }

    const gerarReserva = async() => {
        try{   
            
            let inicio = toDate(startDate, "h:m");
            let fim = toDate(endDate, "h:m");

            const data = {
                nomeCliente: nome,
                cpf: cpf,
                pago: pago,
                horarios: {
                    dia: day,
                    inicio: inicio,
                    fim: fim,
                },
                quadra: selectedQuadra
            }

            const res = await quadrasApi.post('/reservas', data);

            if(res.status === 201){
                setResponse('show');
                setPago(false);
                setStartDate('');
                setEndDate('');
                setNome('');
                setCpf('');
                setSelectedQuadra('');
            }

        } catch {(err) => {console.log(err)}}
    }

    useEffect(() => {
        const listarQuadras = async() => {
            try{       
                const res = await quadrasApi.get('/quadras');
    
                if(res.status === 200){
                    setQuadras(res.data);
                }

            } catch {(err) => {console.log(err)}}
        }

        const listarReservas = async() => {
            try{       
                const res = await quadrasApi.get('/reservas');
    
                if(res.status === 200){
                    setReservas(res.data);
                }
    
            } catch {(err) => {console.log(err)}}
        }

        const startScreenInfo = async() => {
            await listarQuadras();
            await listarReservas();
        }

        startScreenInfo();
    }, []);

    return (
        <View style={{padding: 10}}>
            {showList ?
                <FlatList
                    data={reservas}
                    removeClippedSubviews={false}
                    renderItem={({item}) => 
                        <>
                            <Text>{`Quadra: ${quadras?.map(quadra => {if(quadra._id === item.quadra) return quadra.nome})}`}</Text>
                            <Text>{`Nome do cliente: ${item.nomeCliente}`}</Text>
                            <Text>{`Dia da reserva: ${new Date(item.horarios.dia).toLocaleDateString()}`}</Text>
                            <Text>{`Data inicio: ${new Date(item.horarios.inicio).toLocaleTimeString()}`}</Text>
                            <Text>{`Data termino: ${new Date(item.horarios.fim).toLocaleTimeString()}`}</Text>
                            <Text>--------*--------</Text>
                        </>
                    }
                    keyExtractor={({_id}) => String(_id)}
                />
            :
                <>
                    <View style={{height: '95%'}}>
                        <Text>Selecione a quadra: </Text>
                        <AutocompleteDropdown
                            clearOnFocus={false}
                            closeOnBlur={true}
                            closeOnSubmit={false}
                            onSelectItem={(item) => item && handleSelectQuadra(item.quadra)}
                            dataSet={
                                quadras.map((item, index ) => {
                                    return {
                                        id: index, 
                                        title: item.nome,
                                        quadra: item._id
                                    }
                                }
                            )}
                            renderItem={item => 
                                <Text
                                    style={[
                                        {padding: 10, color: '#8257e5'},
                                        item.disabled && {backgroundColor: '#ccc'}
                                    ]}
                                >
                                    {item.title}
                                </Text>
                            }
                        />

                        <TextInput
                            label="Nome Completo"
                            value={nome}
                            onChangeText={text => setNome(text)}
                        />

                        <TextInput
                            label="CPF"
                            value={cpf}
                            onChangeText={text => setCpf(text)}
                        />

                        {displayDayPicker &&
                            <DateTimePicker  
                                value={day}
                                mode="date" 
                                display='default'
                                minuteInterval={30}
                                onChange={(event, value) => {
                                    setDay(value);
                                    if (Platform.OS === 'android') {
                                        setDisplayDayPicker(false);
                                    }
                                }}
                                minimumDate={Date.parse(new Date())}
                            />
                        }

                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <TouchableOpacity onPress={() => setDisplayDayPicker(true)}>
                                    <Icon name="calendar" size={30} color="#8257e5" />
                                </TouchableOpacity>
                                <Text>
                                    {day.toLocaleDateString()}
                                </Text>
                            </View>

                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Checkbox 
                                    status={pago ? 'checked' : 'uncheked'} 
                                    onPress={() => {setPago(!pago)}}
                                />
                                <Text style={{textTransform: 'uppercase', fontWeight: 'bold'}}>Pago</Text>
                            </View>
                        </View>

                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                width: '100%',
                                height: 80
                            }}
                        >
                            <View style={{width: '45%'}}>
                                <Text>{`Data inicio: ${startDate ? startDate : '00:00' }`}</Text>
                                <AutocompleteDropdown
                                    clearOnFocus={false}
                                    closeOnBlur={true}
                                    closeOnSubmit={false}
                                    onSelectItem={(item) => {
                                            item?.disabled ? setStartDate('') : setStartDate(item?.title)
                                        }
                                    }
                                    dataSet={
                                        horarios?.map((item, index ) => {
                                            return {
                                                id: index, 
                                                title: item.time,
                                                disabled: item.disabled
                                            }
                                        }
                                    )}
                                    renderItem={item => 
                                        <Text
                                            style={[
                                                {padding: 10, color: '#8257e5'},
                                                item.disabled && {backgroundColor: '#ccc'}
                                            ]}
                                        >
                                            {`${item.title} ${item.disabled ? '- Horario já utilizado' : ''}`}
                                        </Text>
                                    }
                                />
                            </View>

                            <View style={{width: '45%'}}>
                                <Text>{`Data fim: ${endDate ? endDate : '00:00' }`}</Text>
                                <AutocompleteDropdown
                                    clearOnFocus={false}
                                    closeOnBlur={true}
                                    closeOnSubmit={false}
                                    onSelectItem={(item) => {
                                            item?.disabled ? setEndDate('') : setEndDate(item?.title)
                                        }
                                    }
                                    dataSet={
                                        horarios?.map((item, index ) => {
                                            return {
                                                id: index, 
                                                title: item.time,
                                                disabled: item.disabled
                                            }
                                        }
                                    )}
                                    renderItem={item => 
                                        <Text
                                            style={[
                                                {padding: 10, color: '#8257e5'},
                                                item.disabled && {backgroundColor: '#ccc'}
                                            ]}
                                        >
                                            {`${item.title} ${item.disabled ? '- Horario já utilizado' : ''}`}
                                        </Text>
                                    }
                                />
                            </View>
                        </View>
                    </View> 

                    <View style={{height: '5%', flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Button mode='contained' style={{backgroundColor: '#0d99ff'}} onPress={() => setShowList(!showList)}>
                            {`${showList ? 'Criar Reserva' : 'Mostrar Reservas'}`}
                        </Button>

                        <Button mode="contained" style={{backgroundColor: '#26c76b'}} onPress={() => gerarReserva()}>
                            Gerar Reserva
                        </Button>
                    </View>
                </>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    flexView: {
        flexDirection: 'row'
    }
})