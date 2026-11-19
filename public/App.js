import React, { useMemo, useState } from "react";
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, StyleSheet, StatusBar } from "react-native";

const demoMarkets = [
  { symbol: "EURUSD", price: "1.08420", change: "+0.18%", bias: "BULLISH" },
  { symbol: "GBPUSD", price: "1.27150", change: "-0.06%", bias: "NEUTRAL" },
  { symbol: "GBPJPY", price: "191.420", change: "+0.31%", bias: "BULLISH" },
  { symbol: "XAUUSD", price: "2,345.60", change: "-0.12%", bias: "BEARISH" }
];

export default function App() {
  const [selected, setSelected] = useState("EURUSD");
  const [tab, setTab] = useState("Markets");
  const market = useMemo(() => demoMarkets.find(x => x.symbol === selected), [selected]);

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={s.container}>
        <View style={s.header}>
          <View>
            <Text style={s.kicker}>AI MARKET INTELLIGENCE</Text>
            <Text style={s.title}>SKY AI <Text style={s.accent}>FOREX PRO</Text></Text>
          </View>
          <View style={s.pill}><Text style={s.pillText}>DEMO MODE</Text></View>
        </View>

        <View style={s.hero}>
          <Text style={s.heroLabel}>MARKET OVERVIEW</Text>
          <Text style={s.heroTitle}>Trade with a plan.</Text>
          <Text style={s.muted}>Structured analysis, risk tools and market watchlists in one place.</Text>
          <Text style={s.disclaimer}>Demo prices only · Not connected to a live feed</Text>
        </View>

        <View style={s.tabs}>
          {["Markets", "Analysis", "Risk"].map(t => (
            <TouchableOpacity key={t} onPress={() => setTab(t)} style={[s.tab, tab === t && s.tabActive]}>
              <Text style={[s.tabText, tab === t && s.tabTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {tab === "Markets" && <>
          <Text style={s.section}>WATCHLIST</Text>
          {demoMarkets.map(item => (
            <TouchableOpacity key={item.symbol} onPress={() => setSelected(item.symbol)} style={[s.market, selected === item.symbol && s.marketSelected]}>
              <View><Text style={s.symbol}>{item.symbol}</Text><Text style={s.mutedSmall}>Forex / CFD · Demo quote</Text></View>
              <View style={{alignItems:"flex-end"}}><Text style={s.price}>{item.price}</Text><Text style={[s.change, item.change.startsWith("+") ? s.green : s.red]}>{item.change}</Text></View>
            </TouchableOpacity>
          ))}
        </>}

        {tab === "Analysis" && <View style={s.card}>
          <Text style={s.section}>TECHNICAL SNAPSHOT</Text>
          <Text style={s.big}>{selected}</Text>
          <Text style={s.bias}>{market?.bias}</Text>
          <Text style={s.body}>This starter does not calculate a live trading signal yet. Connect historical/live candles and validate the strategy before relying on analysis.</Text>
          <View style={s.rule}><Text style={s.muted}>Structure</Text><Text style={s.value}>Awaiting candle feed</Text></View>
          <View style={s.rule}><Text style={s.muted}>Liquidity</Text><Text style={s.value}>Not evaluated</Text></View>
          <View style={s.rule}><Text style={s.muted}>BOS / CHoCH</Text><Text style={s.value}>Not evaluated</Text></View>
        </View>}

        {tab === "Risk" && <View style={s.card}>
          <Text style={s.section}>POSITION RISK PLANNER</Text>
          <Text style={s.body}>Use this checklist before entering a trade:</Text>
          {["Define entry and invalidation level","Risk only a small, predefined part of equity","Calculate position size for your broker contract","Check spread, commission and upcoming news","Set a maximum daily loss"].map(x => <Text key={x} style={s.check}>✓  {x}</Text>)}
          <Text style={s.disclaimer}>Position sizing calculator and broker-specific contract settings will be added in the next build.</Text>
        </View>}

        <View style={s.footer}>
          <Text style={s.footerTitle}>DISCIPLINE FIRST</Text>
          <Text style={s.mutedSmall}>Signals are decision support, not guarantees. Forex and CFDs involve substantial risk.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:{flex:1,backgroundColor:"#07111f"},
  container:{padding:18,paddingBottom:40},
  header:{flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginBottom:22},
  kicker:{color:"#70b7d7",fontSize:10,letterSpacing:2,fontWeight:"700"},
  title:{color:"#f2f7fb",fontSize:21,fontWeight:"900",marginTop:5},
  accent:{color:"#46d4d0"},
  pill:{borderWidth:1,borderColor:"#b88a3b",borderRadius:20,paddingHorizontal:10,paddingVertical:6},
  pillText:{color:"#e4bd70",fontSize:9,fontWeight:"800"},
  hero:{backgroundColor:"#10243a",borderColor:"#1c4960",borderWidth:1,borderRadius:18,padding:18,marginBottom:18},
  heroLabel:{color:"#46d4d0",fontSize:10,fontWeight:"800",letterSpacing:1.5},
  heroTitle:{color:"#fff",fontSize:26,fontWeight:"900",marginTop:9},
  muted:{color:"#9bb0c3",fontSize:13,lineHeight:20,marginTop:7},
  disclaimer:{color:"#d4ae68",fontSize:10,marginTop:12},
  tabs:{flexDirection:"row",backgroundColor:"#0c1b2b",padding:4,borderRadius:12,marginBottom:20},
  tab:{flex:1,padding:11,alignItems:"center",borderRadius:9},
  tabActive:{backgroundColor:"#1b4055"},
  tabText:{color:"#91a7b9",fontWeight:"700"},
  tabTextActive:{color:"#fff"},
  section:{color:"#77a8c0",fontSize:11,fontWeight:"900",letterSpacing:1.4,marginBottom:12},
  market:{backgroundColor:"#0d1d2d",borderColor:"#19354a",borderWidth:1,borderRadius:13,padding:15,marginBottom:9,flexDirection:"row",justifyContent:"space-between"},
  marketSelected:{borderColor:"#46d4d0",backgroundColor:"#10283a"},
  symbol:{color:"#f4f8fb",fontSize:16,fontWeight:"800"},
  mutedSmall:{color:"#8199ad",fontSize:10,marginTop:5},
  price:{color:"#f4f8fb",fontSize:15,fontWeight:"800"},
  change:{fontSize:11,fontWeight:"800",marginTop:5},
  green:{color:"#4bd5a1"},red:{color:"#ed8d8d"},
  card:{backgroundColor:"#0d1d2d",borderColor:"#19354a",borderWidth:1,borderRadius:16,padding:17},
  big:{color:"#fff",fontSize:24,fontWeight:"900"},
  bias:{color:"#46d4d0",fontWeight:"900",marginTop:6},
  body:{color:"#b0c0ce",fontSize:13,lineHeight:21,marginTop:12},
  rule:{borderTopWidth:1,borderTopColor:"#20394c",paddingVertical:12,marginTop:7,flexDirection:"row",justifyContent:"space-between"},
  value:{color:"#e9f2f8",fontWeight:"700",fontSize:12},
  check:{color:"#d9e6ef",fontSize:13,marginTop:13},
  footer:{marginTop:24,padding:15,borderRadius:13,backgroundColor:"#0b1928"},
  footerTitle:{color:"#46d4d0",fontSize:11,fontWeight:"900",letterSpacing:1}
});
