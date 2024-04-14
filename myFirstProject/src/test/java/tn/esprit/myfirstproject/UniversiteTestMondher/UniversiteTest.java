package tn.esprit.myfirstproject.UniversiteTestMondher;

import static org.mockito.Mockito.*;
import static org.junit.Assert.*;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import tn.esprit.myfirstproject.entities.Universite;
import tn.esprit.myfirstproject.repositories.IUniversiteRepository;
import tn.esprit.myfirstproject.services.IUniversiteServicesImp;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@RunWith(MockitoJUnitRunner.class)
public class UniversiteTest {

    @Mock
    private IUniversiteRepository universiteRepository;

    @InjectMocks
    private IUniversiteServicesImp universiteServicesImp;

    @Test
    public void testAddUniversite() {
        // Create a sample Universite object to add
        Universite mockUniversite = new Universite();
        mockUniversite.setIdUniversite(1L);
        mockUniversite.setNomUniversite("Test University");
        mockUniversite.setAdresse("123 Test Lane");

        // Configure the mock to return the specified Universite object on save
        when(universiteRepository.save(any(Universite.class))).thenReturn(mockUniversite);

        // Call the method under test
        Universite savedUniversite = universiteServicesImp.addUniversite(mockUniversite);

        // Assert that the returned Universite object is the same as the mock object
        assertNotNull(savedUniversite);
        assertEquals("Test University", savedUniversite.getNomUniversite());
        assertEquals("123 Test Lane", savedUniversite.getAdresse());

        // Verify that the repository save method was called exactly once with our mock Universite
        verify(universiteRepository, times(1)).save(mockUniversite);
    }

    @Test
    public void testGetAllUniversites() {
        // Setup
        Universite uni1 = new Universite();
        uni1.setNomUniversite("Uni 1");
        Universite uni2 = new Universite();
        uni2.setNomUniversite("Uni 2");
        List<Universite> expectedUniversites = Arrays.asList(uni1, uni2);

        when(universiteRepository.findAll()).thenReturn(expectedUniversites);

        // Execution
        List<Universite> result = universiteServicesImp.getAllUniversites();

        // Verification
        assertNotNull(result);
        assertEquals(2, result.size());
        verify(universiteRepository, times(1)).findAll();
    }

    @Test
    public void testGetUniversiteById() {
        // Setup
        Universite expectedUniversite = new Universite();
        expectedUniversite.setIdUniversite(1L);
        expectedUniversite.setNomUniversite("Test University");

        when(universiteRepository.findById(1L)).thenReturn(Optional.of(expectedUniversite));

        // Execution
        Universite result = universiteServicesImp.getUniversiteById(1L);

        // Verification
        assertNotNull(result);
        assertEquals("Test University", result.getNomUniversite());
        verify(universiteRepository, times(1)).findById(1L);
    }

    @Test
    public void testDeleteUniversiteById() {
        // This test does not need to assert on a return value since the method is void
        Long universiteId = 1L;

        // Execution
        universiteServicesImp.deleteUniversiteById(universiteId);

        // Verification
        verify(universiteRepository, times(1)).deleteById(universiteId);
    }
}
