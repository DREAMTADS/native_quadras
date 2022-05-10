import DateTimePicker  from '@react-native-community/datetimepicker';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, FlatList } from 'react-native';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';
import { Button, Checkbox, TextInput } from 'react-native-paper';
import quadrasApi from '../../services/quadrasApi.js';

export default function Reservas() {
    const [quadras, setQuadras] = useState([]); 
    const [reservas, setReservas] = useState([]);
    const [selectedQuadra, setSelectedQuadra] = useState('');
    const [pago, setPago] = useState(false);
    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [response, setResponse] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [day, setDay] = useState(new Date());
    const [displayStartPicker, setDisplayStartPicker] = useState(false);
    const [displayEndPicker, setDisplayEndPicker] = useState(false);
    const [showList, setShowList] = useState(false);
    const [displayDayPicker, setDisplayDayPicker] = useState(false);

    const gerarReserva = async() => {
        try{       
            const data = {
                nomeCliente: nome,
                cpf: cpf,
                pago: pago,
                horarios: {
                    dia: day,
                    inicio: startDate,
                    fim: endDate,
                },
                quadra: selectedQuadra
            }

            const res = await quadrasApi.post('/reservas', data);

            if(res.status === 201){
                setResponse('show');
                setPago(false);
                setStartDate(new Date());
                setEndDate(new Date());
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
        <View>
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
                    <AutocompleteDropdown
                        clearOnFocus={false}
                        closeOnBlur={true}
                        closeOnSubmit={false}
                        onSelectItem={item => item && setSelectedQuadra(item.quadra)}
                        dataSet={
                            quadras.map((item, index ) => {
                                return {
                                    id: index, 
                                    title: item.nome,
                                    quadra: item._id
                                }
                            }
                        )}
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

                    <View style={styles.flexView}>
                        <Text>Pago: </Text>
                        <Checkbox 
                            status={pago ? 'checked' : 'uncheked'} 
                            onPress={() => {setPago(!pago)}}
                        />
                    </View>

                    <Text>
                        {day.toLocaleDateString()}
                    </Text>
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
                    <Button mode="contained" onPress={() => setDisplayDayPicker(true)}>
                        Selecionar dia da reserva
                    </Button>

                    <Text>
                        {startDate.toLocaleTimeString()}
                    </Text>
                    {displayStartPicker &&
                        <DateTimePicker  
                            value={startDate}
                            mode="time" 
                            display='default'
                            minuteInterval={30}
                            onChange={(event, value) => {
                                setStartDate(value);
                                if (Platform.OS === 'android') {
                                    setDisplayStartPicker(false);
                                }
                            }}
                            minimumDate={Date.parse(new Date())}
                        />
                    }

                    <Button mode="contained" onPress={() => setDisplayStartPicker(true)}>
                        Selecionar horario de inicio
                    </Button>

                    <Text>
                        {endDate.toLocaleTimeString()}
                    </Text>
                    {displayEndPicker &&
                        <DateTimePicker  
                            value={endDate}
                            mode="time" 
                            display='default'
                            minuteInterval={30}
                            onChange={(event, value) => {
                                setEndDate(value);
                                if (Platform.OS === 'android') {
                                    setDisplayEndPicker(false);
                                }
                            }}
                            minimumDate={Date.parse(new Date())}
                        />
                    }

                    <Button mode="contained" onPress={() => setDisplayEndPicker(true)}>
                        Selecionar horario de fim
                    </Button>
                    
                    <Button mode="contained" onPress={() => gerarReserva()}>
                        Gerar Reserva
                    </Button>

                    <Text>
                        {response}
                    </Text>
                </>
            }
            <Button mode='contained' onPress={() => setShowList(!showList)}>
                {`${showList ? 'Criar Reserva' : 'Mostrar Reservas'}`}
            </Button>
        </View>
    )
}

const styles = StyleSheet.create({
    flexView: {
        flexDirection: 'row'
    }
})